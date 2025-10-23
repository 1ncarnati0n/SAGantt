import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Gantt, Willow, defaultColumns } from "wx-react-gantt";
import "../styles/ganttTheme.css";

const START_COLUMN_WIDTH = 100;

// cellWidth 맵핑: 각 뷰별 기본 셀 너비
const CELL_WIDTH_MAP: Record<ViewType, number> = {
  day: 28, // px
  week: 120, // px
  month: 180, // px
};

// cellHeight: 셀의 높이 (행 높이)
const CELL_HEIGHT = 36; // px

// 마일스톤 등 작업 타입 정의
const TASK_TYPES = [
  { id: "task", label: "Task" },
  { id: "summary", label: "Summary task" },
  { id: "milestone", label: "Milestone" },
];

// 작업 타입별 색상 정의
const WORK_TYPE_COLORS: Record<string, string> = {
  direct: "#4CAF50", // 녹색 - 직접작업
  indirect: "#2196F3", // 파란색 - 간접작업
};

type ViewType = "day" | "week" | "month";

interface ScaleConfig {
  unit: "year" | "month" | "day" | "hour" | "week";
  step: number;
  format: string;
  [key: string]: unknown;
}

interface TimeScaleConfig {
  scales: Array<ScaleConfig>;
}

const TIME_SCALE_CONFIGS: Record<ViewType, TimeScaleConfig> = {
  day: {
    scales: [
      { unit: "year", step: 1, format: "yyyy년" },
      { unit: "month", step: 1, format: "M월" },
      { unit: "day", step: 1, format: "d" },
    ],
  },
  week: {
    scales: [
      { unit: "year", step: 1, format: "yyyy년" },
      { unit: "month", step: 1, format: "M월" },
      { unit: "week", step: 1, format: "w주" },
    ],
  },
  month: {
    scales: [
      { unit: "year", step: 1, format: "yyyy년" },
      { unit: "month", step: 1, format: "M월" },
    ],
  },
};

type SaveState = "idle" | "saving" | "saved" | "error";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const toIsoDate = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    if (ISO_DATE_RE.test(value)) {
      return value;
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return undefined;
};

const normalizeNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length) {
    const next = Number(value);
    if (!Number.isNaN(next)) {
      return next;
    }
  }

  return undefined;
};

const serializeTask = (taskInput: Record<string, unknown>): Record<string, unknown> => {
  // 저장할 필드만 선택 (화이트리스트 방식)
  const serialized: Record<string, unknown> = {};

  // 필수 필드
  if (taskInput.id !== undefined) serialized.id = taskInput.id;
  if (taskInput.text !== undefined) serialized.text = taskInput.text;
  if (taskInput.type !== undefined) serialized.type = taskInput.type;

  // 날짜 필드 (ISO 형식으로 변환)
  const startDate = toIsoDate(taskInput.start);
  if (startDate) serialized.start = startDate;

  const endDate = toIsoDate(taskInput.end);
  if (endDate) serialized.end = endDate;

  const baseStart = toIsoDate(taskInput.base_start);
  if (baseStart) serialized.base_start = baseStart;

  const baseEnd = toIsoDate(taskInput.base_end);
  if (baseEnd) serialized.base_end = baseEnd;

  // 숫자 필드
  const normalizedDuration = normalizeNumber(taskInput.duration);
  if (typeof normalizedDuration !== "undefined") {
    serialized.duration = normalizedDuration;
  }

  const normalizedProgress = normalizeNumber(taskInput.progress);
  if (typeof normalizedProgress !== "undefined") {
    serialized.progress = normalizedProgress;
  }

  // 선택적 필드
  if (taskInput.parent !== undefined) serialized.parent = taskInput.parent;
  if (taskInput.lazy !== undefined) serialized.lazy = taskInput.lazy;
  if (taskInput.category !== undefined) serialized.category = taskInput.category;
  if (taskInput.workType !== undefined) serialized.workType = taskInput.workType;
  if (taskInput.open !== undefined) serialized.open = taskInput.open;

  return serialized;
};

const serializeLink = (linkInput: Record<string, unknown>): Record<string, unknown> => {
  // 링크에서 필요한 필드만 저장
  const serialized: Record<string, unknown> = {};

  if (linkInput.id !== undefined) serialized.id = linkInput.id;
  if (linkInput.source !== undefined) serialized.source = linkInput.source;
  if (linkInput.target !== undefined) serialized.target = linkInput.target;
  if (linkInput.type !== undefined) serialized.type = linkInput.type;

  return serialized;
};

const serializeSchedule = (
  tasks: Array<Record<string, unknown>>,
  links: Array<Record<string, unknown>>,
  scales: Array<Record<string, unknown>>,
) => ({
  tasks: tasks.map((task) => serializeTask(task)),
  links: links.map((link) => serializeLink(link)),
  scales: scales.map((scale) => ({
    unit: scale.unit,
    step: scale.step,
    format: scale.format,
  })),
});

export const GanttPreview: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>("day");
  const [showBaselines, setShowBaselines] = useState<boolean>(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<any>(null);
  const apiRef = useRef<any>(null);

  // 컴포넌트 마운트 시 저장된 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading saved data from API...");
        const response = await fetch("/api/mock");

        if (response.ok) {
          const data = await response.json();
          console.log("Loaded data:", data);

          // 날짜 문자열을 Date 객체로 변환
          const processedTasks = data.tasks.map((task: any) => {
            const updatedTask = {
              ...task,
              start: new Date(task.start),
              ...(task.end ? { end: new Date(task.end) } : {}),
              ...(task.base_start ? { base_start: new Date(task.base_start) } : {}),
              ...(task.base_end ? { base_end: new Date(task.base_end) } : {}),
            };

            // workType에 따른 색상 지정
            if (task.workType && WORK_TYPE_COLORS[task.workType as string]) {
              updatedTask.color = WORK_TYPE_COLORS[task.workType as string];
            }

            return updatedTask;
          });

          setSchedule({
            tasks: processedTasks,
            links: data.links || [],
            scales: data.scales || [],
          });
          console.log("Data loaded successfully");
        } else {
          console.log("Failed to load data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = useCallback(async () => {
    console.log("Save button clicked");

    if (!import.meta.env.DEV) {
      console.error("Not in development mode");
      return;
    }

    if (!apiRef.current) {
      console.error("API ref is not available");
      alert("간트 차트가 아직 초기화되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      setSaveState("saving");

      // apiRef에서 현재 상태 가져오기
      const state = apiRef.current.getState();
      console.log("Current state from apiRef:", state);

      if (!state || !state.tasks) {
        throw new Error("Failed to get state from Gantt");
      }

      const payload = serializeSchedule(
        state.tasks || [],
        state.links || [],
        schedule?.scales || []
      );
      console.log("Payload to save:", payload);

      const response = await fetch("/api/mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to persist mock data: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Save result:", result);

      setSaveState("saved");
      setHasChanges(false);
      window.setTimeout(() => {
        setSaveState("idle");
      }, 1500);
    } catch (error) {
      console.error("Save error:", error);
      setSaveState("error");
      alert("저장 중 오류가 발생했습니다: " + (error as Error).message);
    }
  }, [schedule]);

  const markAsChanged = useCallback(() => {
    console.log("Change detected - marking as changed");
    setHasChanges(true);
    setSaveState((prev) => (prev === "saved" ? "idle" : prev));
  }, []);

  // Gantt 이벤트 핸들러들 - 단순히 변경 감지만 수행
  const handleTaskUpdate = useCallback(() => {
    console.log("Task updated");
    markAsChanged();
  }, [markAsChanged]);

  const handleTaskAdd = useCallback(() => {
    console.log("Task added");
    markAsChanged();
  }, [markAsChanged]);

  const handleTaskDelete = useCallback(() => {
    console.log("Task deleted");
    markAsChanged();
  }, [markAsChanged]);

  const handleTaskMove = useCallback(() => {
    console.log("Task moved");
    markAsChanged();
  }, [markAsChanged]);

  const handleLinkAdd = useCallback(() => {
    console.log("Link added");
    markAsChanged();
  }, [markAsChanged]);

  const handleLinkUpdate = useCallback(() => {
    console.log("Link updated");
    markAsChanged();
  }, [markAsChanged]);

  const handleLinkDelete = useCallback(() => {
    console.log("Link deleted");
    markAsChanged();
  }, [markAsChanged]);

  const columns = useMemo(() => {
    return defaultColumns.map((column) => {
      if (column.id === "text") {
        return { ...column, header: "단위공정" };
      }

      if (column.id === "start") {
        return {
          ...column,
          header: "시작",
          width: START_COLUMN_WIDTH,
          format: "yyyy-MM-dd", // 날짜 형식: yyyy-MM-dd (년-월-일)
        };
      }

      if (column.id === "duration") {
        return { ...column, header: "일수", width: START_COLUMN_WIDTH * 0.4 };
      }

      return column;
    });
  }, []);

  const handleViewTypeChange = (newViewType: ViewType) => {
    setViewType(newViewType);
  };

  const displayScales = useMemo(() => {
    const config = TIME_SCALE_CONFIGS[viewType];
    return config.scales;
  }, [viewType]);

  return (
    <section>
      <header>
        <h2>공동주택 골조공사 표준공정</h2>
      </header>
      <div className="mb-5 p-4 bg-gray-100 rounded">
        <button
          onClick={() => handleViewTypeChange("day")}
          className={`px-4 py-2 mr-2 rounded border-none cursor-pointer ${
            viewType === "day"
              ? "bg-green-500 text-white font-bold"
              : "bg-gray-300 text-black font-normal"
          }`}
        >
          일
        </button>
        <button
          onClick={() => handleViewTypeChange("week")}
          className={`px-4 py-2 mr-2 rounded border-none cursor-pointer ${
            viewType === "week"
              ? "bg-green-500 text-white font-bold"
              : "bg-gray-300 text-black font-normal"
          }`}
        >
          주
        </button>
        <button
          onClick={() => handleViewTypeChange("month")}
          className={`px-4 py-2 rounded border-none cursor-pointer ${
            viewType === "month"
              ? "bg-green-500 text-white font-bold"
              : "bg-gray-300 text-black font-normal"
          }`}
        >
          월
        </button>
        <button
          onClick={() => setShowBaselines((prev) => !prev)}
          className={`px-4 py-2 rounded border-none cursor-pointer ${
            showBaselines
              ? "bg-purple-500 text-white font-bold"
              : "bg-gray-300 text-black font-normal"
          }`}
          aria-pressed={showBaselines}
        >
          기준 일정 {showBaselines ? "숨기기" : "표시"}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveState === "saving"}
          className={`ml-2 px-4 py-2 rounded border-none cursor-pointer ${
            hasChanges && saveState !== "saving"
              ? "bg-blue-500 text-white font-bold hover:bg-blue-600"
              : "bg-gray-400 text-gray-200 font-normal cursor-not-allowed"
          }`}
          title={`hasChanges: ${hasChanges}, saveState: ${saveState}`}
        >
          {saveState === "saving" ? "저장 중..." : "저장"}
        </button>
        <span className="ml-4 text-sm text-gray-600" role="status">
          {hasChanges && saveState === "idle" && "변경 사항이 있습니다."}
          {saveState === "saved" && "변경 내용이 mock.json에 저장되었습니다."}
          {saveState === "error" && "저장 실패 - 콘솔을 확인하세요."}
          <span className="ml-2 text-xs text-gray-400">(Debug: hasChanges={String(hasChanges)})</span>
        </span>
      </div>
      <div className="gantt-wrapper" role="figure" aria-label="Project Gantt chart">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <span className="text-gray-600">데이터를 불러오는 중...</span>
          </div>
        ) : schedule ? (
          <Willow>
            <Gantt
              tasks={schedule.tasks}
              links={schedule.links}
              scales={displayScales}
              columns={columns}
              taskTypes={TASK_TYPES}
              cellWidth={CELL_WIDTH_MAP[viewType]}
              cellHeight={CELL_HEIGHT}
              baselines={showBaselines}
              apiRef={apiRef}
              onUpdateTask={handleTaskUpdate}
              onAddTask={handleTaskAdd}
              onDeleteTask={handleTaskDelete}
              onMoveTask={handleTaskMove}
              onAddLink={handleLinkAdd}
              onUpdateLink={handleLinkUpdate}
              onDeleteLink={handleLinkDelete}
            />
          </Willow>
        ) : (
          <div className="flex items-center justify-center p-8">
            <span className="text-gray-600">데이터를 불러오지 못했습니다.</span>
          </div>
        )}
      </div>
    </section>
  );
};

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

const idsAreEqual = (left: unknown, right: unknown): boolean => String(left) === String(right);

const toPlainTask = (payload: any): Record<string, unknown> | null => {
  if (!payload) {
    return null;
  }

  if (payload.task && typeof payload.task === "object") {
    const normalizedTask = { ...payload.task };
    if (normalizedTask.id === undefined && payload.id !== undefined) {
      normalizedTask.id = payload.id;
    }
    return normalizedTask;
  }

  if (typeof payload === "object") {
    return { ...payload };
  }

  return null;
};

const toPlainLink = (payload: any): Record<string, unknown> | null => {
  if (!payload) {
    return null;
  }

  if (payload.link && typeof payload.link === "object") {
    const normalizedLink = { ...payload.link };
    if (normalizedLink.id === undefined && payload.id !== undefined) {
      normalizedLink.id = payload.id;
    }
    return normalizedLink;
  }

  if (typeof payload === "object") {
    return { ...payload };
  }

  return null;
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

  // 현재 tasks와 links를 추적 (Gantt 내부 상태 동기화)
  const currentTasksRef = useRef<any[]>([]);
  const currentLinksRef = useRef<any[]>([]);

  const getTaskFromApi = useCallback((taskId: unknown): Record<string, unknown> | null => {
    const api = apiRef.current;
    if (!api || typeof api.getTask !== "function") {
      return null;
    }

    try {
      const task = api.getTask(taskId);
      return task ? { ...task } : null;
    } catch (error) {
      console.warn("Failed to fetch task from API:", error);
      return null;
    }
  }, []);

  // 컴포넌트 마운트 시 저장된 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/mock");

        if (response.ok) {
          const data = await response.json();

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

          // Ref에도 초기 데이터 저장
          currentTasksRef.current = processedTasks;
          currentLinksRef.current = data.links || [];
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
    if (!import.meta.env.DEV) {
      console.error("Not in development mode");
      return;
    }

    try {
      setSaveState("saving");

      // Ref에 저장된 현재 데이터 사용
      const tasksToSave = currentTasksRef.current;
      const linksToSave = currentLinksRef.current;

      if (tasksToSave.length === 0) {
        throw new Error("No tasks to save");
      }

      // 데이터 직렬화
      const payload = serializeSchedule(
        tasksToSave,
        linksToSave,
        schedule?.scales || []
      );

      // 서버에 저장
      const response = await fetch("/api/mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

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

  // 변경 감지
  const markAsChanged = useCallback(() => {
    setHasChanges(true);
    setSaveState((prev) => (prev === "saved" ? "idle" : prev));
  }, []);

  // Ref 업데이트 헬퍼 함수
  const updateTaskInRef = useCallback((taskPayload: any) => {
    const normalizedTask = toPlainTask(taskPayload);
    const targetId =
      normalizedTask?.id ??
      taskPayload?.id ??
      (typeof taskPayload === "string" || typeof taskPayload === "number" ? taskPayload : undefined);

    if (targetId === undefined || targetId === null) {
      console.warn("Cannot update task ref - missing id:", taskPayload);
      return;
    }

    const index = currentTasksRef.current.findIndex((t) => idsAreEqual(t.id, targetId));
    const source = normalizedTask ?? getTaskFromApi(targetId);

    if (!source) {
      console.warn("Cannot resolve task payload for update:", taskPayload);
      return;
    }

    if (index === -1) {
      currentTasksRef.current.push(source);
      return;
    }

    currentTasksRef.current[index] = { ...currentTasksRef.current[index], ...source };
  }, [getTaskFromApi]);

  // Gantt 이벤트 핸들러들 - ref 업데이트 + 변경 감지
  const handleTaskUpdate = useCallback((event: any) => {
    updateTaskInRef(event);
    markAsChanged();
  }, [markAsChanged, updateTaskInRef]);

  const handleTaskAdd = useCallback((event: any) => {
    const normalizedTask = toPlainTask(event) ?? getTaskFromApi(event?.id);

    if (!normalizedTask || normalizedTask.id === undefined || normalizedTask.id === null) {
      console.warn("Cannot append task without id:", event);
      return;
    }

    const existingIndex = currentTasksRef.current.findIndex((task) => idsAreEqual(task.id, normalizedTask.id));
    if (existingIndex === -1) {
      currentTasksRef.current.push(normalizedTask);
    } else {
      currentTasksRef.current[existingIndex] = {
        ...currentTasksRef.current[existingIndex],
        ...normalizedTask,
      };
    }

    markAsChanged();
  }, [getTaskFromApi, markAsChanged]);

  const handleTaskDelete = useCallback((event: any) => {
    const targetId = event?.id ?? event?.task?.id;

    if (targetId === undefined || targetId === null) {
      console.warn("Cannot delete task without id:", event);
      return;
    }

    currentTasksRef.current = currentTasksRef.current.filter((t) => !idsAreEqual(t.id, targetId));
    markAsChanged();
  }, [markAsChanged]);

  const handleTaskMove = useCallback((event: any) => {
    updateTaskInRef(event);
    markAsChanged();
  }, [markAsChanged, updateTaskInRef]);

  const handleLinkAdd = useCallback((event: any) => {
    const normalizedLink = toPlainLink(event);

    if (!normalizedLink || normalizedLink.id === undefined || normalizedLink.id === null) {
      console.warn("Cannot append link without id:", event);
      return;
    }

    const existingIndex = currentLinksRef.current.findIndex((link) => idsAreEqual(link.id, normalizedLink.id));
    if (existingIndex === -1) {
      currentLinksRef.current.push(normalizedLink);
    } else {
      currentLinksRef.current[existingIndex] = {
        ...currentLinksRef.current[existingIndex],
        ...normalizedLink,
      };
    }

    markAsChanged();
  }, [markAsChanged]);

  const handleLinkUpdate = useCallback((event: any) => {
    const normalizedLink = toPlainLink(event);
    const targetId =
      normalizedLink?.id ??
      event?.id ??
      (typeof event === "string" || typeof event === "number" ? event : undefined);

    if (targetId === undefined || targetId === null) {
      console.warn("Cannot update link without id:", event);
      return;
    }

    const index = currentLinksRef.current.findIndex((l) => idsAreEqual(l.id, targetId));
    if (index !== -1) {
      if (!normalizedLink) {
        console.warn("Cannot resolve link payload for update:", event);
        return;
      }
      currentLinksRef.current[index] = { ...currentLinksRef.current[index], ...normalizedLink };
    }
    markAsChanged();
  }, [markAsChanged]);

  const handleLinkDelete = useCallback((event: any) => {
    const targetId = event?.id ?? event?.link?.id;

    if (targetId === undefined || targetId === null) {
      console.warn("Cannot delete link without id:", event);
      return;
    }

    currentLinksRef.current = currentLinksRef.current.filter((l) => !idsAreEqual(l.id, targetId));
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
          className={`btn btn-view ${viewType === "day" ? "active" : ""}`}
        >
          일
        </button>
        <button
          onClick={() => handleViewTypeChange("week")}
          className={`btn btn-view ${viewType === "week" ? "active" : ""}`}
        >
          주
        </button>
        <button
          onClick={() => handleViewTypeChange("month")}
          className={`btn btn-view ${viewType === "month" ? "active" : ""}`}
        >
          월
        </button>
        <button
          onClick={() => setShowBaselines((prev) => !prev)}
          className={`btn btn-toggle ${showBaselines ? "active" : ""}`}
          aria-pressed={showBaselines}
        >
          계획 일정 {showBaselines ? "숨기기" : "표시"}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveState === "saving"}
          className="btn btn-save"
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
              init={(api: any) => (apiRef.current = api)}
              tasks={schedule.tasks}
              links={schedule.links}
              scales={displayScales}
              columns={columns}
              taskTypes={TASK_TYPES}
              cellWidth={CELL_WIDTH_MAP[viewType]}
              cellHeight={CELL_HEIGHT}
              baselines={showBaselines}
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

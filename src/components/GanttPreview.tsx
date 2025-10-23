import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Gantt, Willow, defaultColumns } from "wx-react-gantt";
import "../styles/ganttTheme.css";

import { getDemoSchedule } from "../data/demoSchedule";

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
  const {
    start,
    end,
    base_start,
    base_end,
    duration,
    progress,
    $open,
    $level,
    parent,
    ...rest
  } = taskInput;

  const serialized: Record<string, unknown> = {
    ...rest,
    ...(typeof parent !== "undefined" ? { parent } : {}),
  };

  const startDate = toIsoDate(start);
  if (startDate) {
    serialized.start = startDate;
  }

  const endDate = toIsoDate(end);
  if (endDate) {
    serialized.end = endDate;
  }

  const baseStart = toIsoDate(base_start);
  if (baseStart) {
    serialized.base_start = baseStart;
  }

  const baseEnd = toIsoDate(base_end);
  if (baseEnd) {
    serialized.base_end = baseEnd;
  }

  const normalizedDuration = normalizeNumber(duration);
  if (typeof normalizedDuration !== "undefined") {
    serialized.duration = normalizedDuration;
  }

  const normalizedProgress = normalizeNumber(progress);
  if (typeof normalizedProgress !== "undefined") {
    serialized.progress = normalizedProgress;
  }

  // Remove undefined/null values to keep JSON lean.
  Object.keys(serialized).forEach((key) => {
    if (key.startsWith("$")) {
      delete serialized[key];
      return;
    }

    if (
      typeof serialized[key] === "undefined" ||
      serialized[key] === null ||
      serialized[key] === ""
    ) {
      delete serialized[key];
    }
  });

  return serialized;
};

const serializeSchedule = (
  tasks: Array<Record<string, unknown>>,
  links: Array<Record<string, unknown>>,
  scales: Array<Record<string, unknown>>,
) => ({
  tasks: tasks.map((task) => serializeTask(task)),
  links: links.map((link) => ({ ...link })),
  scales: scales.map((scale) => ({ ...scale })),
});

export const GanttPreview: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>("day");
  const [showBaselines, setShowBaselines] = useState<boolean>(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const apiRef = useRef<any>(null);
  const saveTimeoutRef = useRef<number>();

  const schedule = useMemo(() => {
    const data = getDemoSchedule();
    // 마일스톤 처리 및 workType에 따른 색상 지정
    const processedTasks = data.tasks.map((task) => {
      const updatedTask = { ...task };

      // workType에 따른 색상 지정 (직접작업/간접작업 구분)
      if (task.workType && WORK_TYPE_COLORS[task.workType as string]) {
        updatedTask.color = WORK_TYPE_COLORS[task.workType as string];
      }

      return updatedTask;
    });
    return {
      ...data,
      tasks: processedTasks,
    };
  }, []);

  const persistSchedule = useCallback(async () => {
    if (!apiRef.current || !import.meta.env.DEV) {
      return;
    }

    try {
      setSaveState("saving");
      const state = apiRef.current.getState();
      const payload = serializeSchedule(state.tasks ?? [], state.links ?? [], schedule.scales ?? []);

      const response = await fetch("/api/mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to persist mock data: ${response.statusText}`);
      }

      setSaveState("saved");
      window.setTimeout(() => {
        setSaveState("idle");
      }, 1500);
    } catch (error) {
      console.error(error);
      setSaveState("error");
    }
  }, [schedule.scales]);

  const queuePersist = useCallback(() => {
    window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      void persistSchedule();
      saveTimeoutRef.current = undefined;
    }, 400);
  }, [persistSchedule]);

  useEffect(() => {
    if (!apiRef.current) {
      return;
    }

    const api = apiRef.current;
    const events = ["add-task", "update-task", "delete-task", "move-task"];

    events.forEach((event) => {
      api.on(event, queuePersist);
    });

    return () => {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = undefined;
      if (api && typeof api.detach === "function") {
        api.detach();
      }
    };
  }, [queuePersist]);

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

  const scales = useMemo(() => {
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
        <span className="ml-4 text-sm text-gray-600" role="status">
          {saveState === "saving" && "저장 중..."}
          {saveState === "saved" && "변경 내용이 mock.json에 저장되었습니다."}
          {saveState === "error" && "저장 실패 - 콘솔을 확인하세요."}
        </span>
      </div>
      <div className="gantt-wrapper" role="figure" aria-label="Project Gantt chart">
        <Willow>
          <Gantt
            tasks={schedule.tasks}
            links={schedule.links}
            scales={scales}
            columns={columns}
            taskTypes={TASK_TYPES}
            cellWidth={CELL_WIDTH_MAP[viewType]}
            cellHeight={CELL_HEIGHT}
            baselines={showBaselines}
            apiRef={apiRef}
          />
        </Willow>
      </div>
    </section>
  );
};

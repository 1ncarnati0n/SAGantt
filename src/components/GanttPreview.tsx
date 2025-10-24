import React, { useMemo, useState } from "react";

import { Gantt, Willow, defaultColumns } from "wx-react-gantt";

import "../styles/ganttTheme.css";
import { GanttControls } from "./gantt/GanttControls";
import { useGanttSchedule } from "./gantt/useGanttSchedule";
import type { ViewType } from "./gantt/types";

const START_COLUMN_WIDTH = 100;

const CELL_WIDTH_MAP: Record<ViewType, number> = {
  day: 28,
  week: 120,
  month: 180,
};

const CELL_HEIGHT = 36;

const TASK_TYPES = [
  { id: "task", label: "Task" },
  { id: "summary", label: "Summary task" },
  { id: "milestone", label: "Milestone" },
];

const WORK_TYPE_COLORS: Record<string, string> = {
  direct: "#4CAF50",
  indirect: "#2196F3",
};

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

export const GanttPreview: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>("day");
  const [showBaselines, setShowBaselines] = useState<boolean>(true);

  const { schedule, isLoading, saveState, hasChanges, handleSave, handlers, initGantt } = useGanttSchedule({
    workTypeColors: WORK_TYPE_COLORS,
  });

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
          format: "yyyy-MM-dd",
        };
      }

      if (column.id === "duration") {
        return { ...column, header: "일수", width: START_COLUMN_WIDTH * 0.4 };
      }

      return column;
    });
  }, []);

  const displayScales = useMemo(() => TIME_SCALE_CONFIGS[viewType].scales, [viewType]);

  const handleToggleBaselines = () => {
    setShowBaselines((prev) => !prev);
  };

  return (
    <section>
      <header>
        <h2>공동주택 골조공사 표준공정</h2>
      </header>
      <GanttControls
        viewType={viewType}
        onViewTypeChange={setViewType}
        showBaselines={showBaselines}
        onToggleBaselines={handleToggleBaselines}
        onSave={() => {
          void handleSave();
        }}
        hasChanges={hasChanges}
        saveState={saveState}
      />
      <div className="gantt-wrapper" role="figure" aria-label="Project Gantt chart">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <span className="text-gray-600">데이터를 불러오는 중...</span>
          </div>
        ) : schedule ? (
          <Willow>
            <Gantt
              init={initGantt}
              tasks={schedule.tasks}
              links={schedule.links}
              scales={displayScales}
              columns={columns}
              taskTypes={TASK_TYPES}
              cellWidth={CELL_WIDTH_MAP[viewType]}
              cellHeight={CELL_HEIGHT}
              baselines={showBaselines}
              {...handlers}
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

export default GanttPreview;

import React, { useMemo, useState } from "react";

import { Gantt, Willow, defaultColumns } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

import { getDemoSchedule } from "../data/demoSchedule";

const START_COLUMN_WIDTH = 100;

// cellWidth 맵핑: 각 뷰별 기본 셀 너비
const CELL_WIDTH_MAP: Record<ViewType, number> = {
    day: 38,      // px
    week: 120,    // px
    month: 180,  // px
};

// cellHeight: 셀의 높이 (행 높이)
const CELL_HEIGHT = 36;  // px

// 마일스톤 등 작업 타입 정의
const TASK_TYPES = [
    { id: "task", label: "Task" },
    { id: "summary", label: "Summary task" },
    { id: "milestone", label: "Milestone" },
];

// 작업 타입별 색상 정의
const WORK_TYPE_COLORS: Record<string, string> = {
    direct: "#4CAF50",      // 녹색 - 직접작업
    indirect: "#2196F3",    // 파란색 - 간접작업
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
            { unit: "day", step: 1, format: "d일" },
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
                    format: "yyyy-MM-dd"  // 날짜 형식: yyyy-MM-dd (년-월-일)
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
                        baselines={true}
                    />
                </Willow>
            </div>
        </section>
    );
};

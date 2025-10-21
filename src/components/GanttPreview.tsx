import React, { useMemo, useState } from "react";

import { Gantt, Willow, defaultColumns } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

import { getDemoSchedule } from "../data/demoSchedule";

const START_COLUMN_WIDTH = 100;
const DAY_SCALE_WIDTH = 10;
const WEEK_SCALE_WIDTH = 80;
const MONTH_SCALE_WIDTH = 120;

type ViewType = "day" | "week" | "month";

interface ScaleConfig {
    unit: "year" | "month" | "day" | "hour" | "week";
    step: number;
    format: string;
    cellWidth?: number;
}

interface TimeScaleConfig {
    scaleWidth: number;
    scales: Array<Omit<ScaleConfig, "cellWidth">>;
}

const TIME_SCALE_CONFIGS: Record<ViewType, TimeScaleConfig> = {
    day: {
        scaleWidth: DAY_SCALE_WIDTH,
        scales: [
            { unit: "month", step: 1, format: "yyyy년 M월" },
            { unit: "day", step: 1, format: "d일" },
        ],
    },
    week: {
        scaleWidth: WEEK_SCALE_WIDTH,
        scales: [
            { unit: "month", step: 1, format: "yyyy년 M월" },
            { unit: "week", step: 1, format: "w주" },
        ],
    },
    month: {
        scaleWidth: MONTH_SCALE_WIDTH,
        scales: [
            { unit: "month", step: 1, format: "yyyy년 M월" },
        ],
    },
};

export const GanttPreview: React.FC = () => {
    const [viewType, setViewType] = useState<ViewType>("week");

    const schedule = useMemo(() => {
        const data = getDemoSchedule();
        // 마일스톤 처리: duration을 0으로 설정하여 다이아몬드로 표시
        const processedTasks = data.tasks.map((task) => {
            if (task.type === "milestone") {
                return {
                    ...task,
                    duration: 0,
                    progress: 100,
                };
            }
            return task;
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
                return { ...column, header: "시작", width: START_COLUMN_WIDTH };
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
        return config.scales.map((scale) => ({
            ...scale,
            cellWidth: config.scaleWidth,
        }));
    }, [viewType]);

    return (
        <section>
            <header>
                <h2>공동주택 골조공사 표준공정</h2>
                <p>지하골조(벽체+슬라브)</p>
            </header>

            <div className="mb-5 p-4 bg-gray-100 rounded">
                <label className="mr-3 font-bold">보기 모드:</label>
                <button
                    onClick={() => handleViewTypeChange("day")}
                    className={`px-4 py-2 mr-2 rounded border-none cursor-pointer ${
                        viewType === "day"
                            ? "bg-green-500 text-white font-bold"
                            : "bg-gray-300 text-black font-normal"
                    }`}
                >
                    일 단위
                </button>
                <button
                    onClick={() => handleViewTypeChange("week")}
                    className={`px-4 py-2 mr-2 rounded border-none cursor-pointer ${
                        viewType === "week"
                            ? "bg-green-500 text-white font-bold"
                            : "bg-gray-300 text-black font-normal"
                    }`}
                >
                    주 단위
                </button>
                <button
                    onClick={() => handleViewTypeChange("month")}
                    className={`px-4 py-2 rounded border-none cursor-pointer ${
                        viewType === "month"
                            ? "bg-green-500 text-white font-bold"
                            : "bg-gray-300 text-black font-normal"
                    }`}
                >
                    월 단위
                </button>
            </div>

            <div className="gantt-wrapper" role="figure" aria-label="Project Gantt chart">
                <Willow>
                    <Gantt
                        tasks={schedule.tasks}
                        links={schedule.links}
                        scales={scales}
                        columns={columns}
                    />
                </Willow>
            </div>
        </section>
    );
};

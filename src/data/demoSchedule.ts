import rawMock from "./mock.json";

export type TaskType = "task" | "summary" | "milestone";
export type WorkType = "direct" | "indirect";

export interface DemoTask {
    id: number;
    text: string;
    start: Date;
    end?: Date;
    duration: number;
    progress: number;
    type: TaskType;
    parent?: number;
    lazy?: boolean;
    category?: string;
    workType?: WorkType;
    color?: string;
    open?: boolean;
    base_start?: Date;
    base_end?: Date;
    base_duration?: number;
    [key: string]: unknown;
}

export interface DemoLink {
    id: number;
    source: number;
    target: number;
    type: "e2e" | "s2s" | "e2s" | "s2e";
    [key: string]: unknown;
}

export interface DemoScale {
    unit: "year" | "month" | "day" | "hour";
    step: number;
    format: string;
}

export interface DemoSchedule {
    tasks: DemoTask[];
    links: DemoLink[];
    scales: DemoScale[];
}

interface MockTask {
    id: number;
    text: string;
    start: string;
    end: string;
    duration: number;
    progress: number;
    type: TaskType;
    parent?: number;
    lazy?: boolean;
    category?: string;
    workType?: WorkType;
    color?: string;
    open?: boolean;
    base_start?: string;
    base_end?: string;
    base_duration?: number;
}

interface MockLink {
    id: number;
    source: number;
    target: number;
    type: "e2e" | "s2s" | "e2s" | "s2e";
}

interface MockScale {
    unit: "year" | "month" | "day" | "hour";
    step: number;
    format: string;
}

interface MockSchedule {
    tasks: MockTask[];
    links: MockLink[];
    scales: MockScale[];
}

const parseMockSchedule = (mock: MockSchedule): DemoSchedule => ({
    tasks: mock.tasks.map((task) => {
        const {
            base_start,
            base_end,
            start,
            end,
            ...rest
        } = task;

        return {
            ...rest,
            start: new Date(start),
            end: new Date(end),
            ...(base_start ? { base_start: new Date(base_start) } : {}),
            ...(base_end ? { base_end: new Date(base_end) } : {}),
        } as DemoTask;
    }),
    links: mock.links.map((link) => ({ ...link })),
    scales: mock.scales.map((scale) => ({ ...scale })),
});

const cached = parseMockSchedule(rawMock as MockSchedule);

export const demoSchedule: DemoSchedule = cached;

export const getDemoSchedule = (): DemoSchedule => ({
    tasks: cached.tasks.map((task) => {
        const processedTask = {
            ...task,
            start: new Date(task.start),
            ...(task.end ? { end: new Date(task.end) } : {}),
            ...(task.base_start ? { base_start: new Date(task.base_start) } : {}),
            ...(task.base_end ? { base_end: new Date(task.base_end) } : {}),
        };

        // 마일스톤을 다이아몬드로 표시하기 위한 처리
        if (task.type === "milestone") {
            const { end, ...rest } = processedTask;
            return {
                ...rest,
                duration: 0,
                progress: 100,
            };
        }

        return processedTask;
    }),
    links: cached.links.map((link) => ({ ...link })),
    scales: cached.scales.map((scale) => ({ ...scale })),
});

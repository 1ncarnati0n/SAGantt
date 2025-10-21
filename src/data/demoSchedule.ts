import rawMock from "./mock.json";

export type TaskType = "task" | "summary" | "milestone";
export type WorkType = "direct" | "indirect";

export interface DemoTask {
    id: number;
    text: string;
    start: Date;
    end: Date;
    duration: number;
    progress: number;
    type: TaskType;
    parent?: number;
    lazy?: boolean;
    category?: string;
    workType?: WorkType;
    color?: string;
}

export interface DemoLink {
    id: number;
    source: number;
    target: number;
    type: "e2e" | "s2s" | "e2s" | "s2e";
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
    tasks: mock.tasks.map((task) => ({
        ...task,
        start: new Date(task.start),
        end: new Date(task.end),
    })),
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
            end: new Date(task.end),
        };

        // 마일스톤을 다이아몬드로 표시하기 위한 처리
        if (task.type === "milestone") {
            processedTask.duration = 0;
            processedTask.progress = 100;
        }

        return processedTask;
    }),
    links: cached.links.map((link) => ({ ...link })),
    scales: cached.scales.map((scale) => ({ ...scale })),
});

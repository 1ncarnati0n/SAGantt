import type { ViewType } from "./types";

export const TASK_TYPES = [
  { id: "task", label: "기본 작업" },
  { id: "taskA", label: "Task A" },
  { id: "taskB", label: "Task B" },
  { id: "summary", label: "요약 작업" },
  { id: "milestone", label: "마일스톤" },
];

export const CELL_WIDTH_MAP: Record<ViewType, number> = {
  day: 28,
  week: 120,
  month: 180,
};

export const CELL_HEIGHT = 36;

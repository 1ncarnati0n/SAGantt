export type ViewType = "day" | "week" | "month";

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface ScheduleData {
  tasks: Array<Record<string, unknown>>;
  links: Array<Record<string, unknown>>;
  scales: Array<Record<string, unknown>>;
}

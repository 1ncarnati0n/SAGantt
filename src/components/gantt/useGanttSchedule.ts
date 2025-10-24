import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { SaveState, ScheduleData } from "./types";

interface UseGanttScheduleResult {
  schedule: ScheduleData | null;
  isLoading: boolean;
  saveState: SaveState;
  hasChanges: boolean;
  handleSave: () => Promise<void>;
  handlers: {
    onUpdateTask: (event: any) => void;
    onAddTask: (event: any) => void;
    onDeleteTask: (event: any) => void;
    onMoveTask: (event: any) => void;
    onAddLink: (event: any) => void;
    onUpdateLink: (event: any) => void;
    onDeleteLink: (event: any) => void;
  };
  initGantt: (api: any) => void;
}

const TYPE_COLORS: Record<string, { bar: string; progress: string }> = {
  taskA: { bar: "#6366f1", progress: "#c7d2fe" },
  taskB: { bar: "#ec4899", progress: "#fbcfe8" },
};

const toIsoDate = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().split("T")[0];
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString().split("T")[0];
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
  const serialized: Record<string, unknown> = {};

  if (taskInput.id !== undefined) serialized.id = taskInput.id;
  if (taskInput.text !== undefined) serialized.text = taskInput.text;
  if (taskInput.type !== undefined) serialized.type = taskInput.type;

  const startDate = toIsoDate(taskInput.start);
  if (startDate) serialized.start = startDate;

  const endDate = toIsoDate(taskInput.end);
  if (endDate) serialized.end = endDate;

  const baseStart = toIsoDate(taskInput.base_start);
  if (baseStart) serialized.base_start = baseStart;

  const baseEnd = toIsoDate(taskInput.base_end);
  if (baseEnd) serialized.base_end = baseEnd;

  const normalizedDuration = normalizeNumber(taskInput.duration);
  if (typeof normalizedDuration !== "undefined") {
    serialized.duration = normalizedDuration;
  }

  const normalizedProgress = normalizeNumber(taskInput.progress);
  if (typeof normalizedProgress !== "undefined") {
    serialized.progress = normalizedProgress;
  }

  if (taskInput.parent !== undefined) serialized.parent = taskInput.parent;
  if (taskInput.lazy !== undefined) serialized.lazy = taskInput.lazy;
  if (taskInput.category !== undefined) serialized.category = taskInput.category;
  if (taskInput.workType !== undefined) serialized.workType = taskInput.workType;
  if (taskInput.open !== undefined) serialized.open = taskInput.open;

  return serialized;
};

const serializeLink = (linkInput: Record<string, unknown>): Record<string, unknown> => {
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

const toDateOrUndefined = (value: unknown): Date | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  const next = new Date(value);
  return Number.isNaN(next.getTime()) ? undefined : next;
};

const decorateTask = (task: Record<string, unknown>): Record<string, unknown> => {
  const decorated: Record<string, unknown> = { ...task };

  const start = toDateOrUndefined(decorated.start);
  if (start) decorated.start = start;

  const end = toDateOrUndefined(decorated.end);
  if (end) decorated.end = end;

  const baseStart = toDateOrUndefined(decorated.base_start);
  if (baseStart) decorated.base_start = baseStart;

  const baseEnd = toDateOrUndefined(decorated.base_end);
  if (baseEnd) decorated.base_end = baseEnd;

  const typeKey = typeof decorated.type === "string" ? decorated.type : "";
  const palette = TYPE_COLORS[typeKey];
  if (palette) {
    decorated.color = palette.bar;
    decorated.progressColor = palette.progress;
  }

  return decorated;
};

export const useGanttSchedule = (): UseGanttScheduleResult => {
  const apiRef = useRef<any>(null);
  const currentTasksRef = useRef<Array<Record<string, unknown>>>([]);
  const currentLinksRef = useRef<Array<Record<string, unknown>>>([]);

  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const markAsChanged = useCallback(() => {
    setHasChanges(true);
    setSaveState((prev) => (prev === "saved" ? "idle" : prev));
  }, []);

  const updateScheduleState = useCallback(() => {
    setSchedule((prev) =>
      prev
        ? {
            ...prev,
            tasks: currentTasksRef.current.map((task) => ({ ...task })),
            links: currentLinksRef.current.map((link) => ({ ...link })),
          }
        : prev,
    );
  }, []);

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

  const updateTaskInRef = useCallback(
    (taskPayload: any) => {
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

      const decorated = decorateTask(source);

      if (index === -1) {
        currentTasksRef.current = [...currentTasksRef.current, decorated];
        return;
      }

      const nextTasks = [...currentTasksRef.current];
      nextTasks[index] = { ...nextTasks[index], ...decorated };
      currentTasksRef.current = nextTasks;
    },
    [getTaskFromApi],
  );

  const handleSave = useCallback(async () => {
    if (!import.meta.env.DEV) {
      console.error("Not in development mode");
      return;
    }

    try {
      setSaveState("saving");

      const tasksToSave = currentTasksRef.current;
      const linksToSave = currentLinksRef.current;

      if (tasksToSave.length === 0) {
        throw new Error("No tasks to save");
      }

      const payload = serializeSchedule(tasksToSave, linksToSave, schedule?.scales || []);

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
  }, [schedule?.scales]);

  const handleTaskUpdate = useCallback(
    (event: any) => {
      updateTaskInRef(event);
      markAsChanged();
      updateScheduleState();
    },
    [markAsChanged, updateScheduleState, updateTaskInRef],
  );

  const handleTaskAdd = useCallback(
    (event: any) => {
      updateTaskInRef(event);
      markAsChanged();
      updateScheduleState();
    },
    [markAsChanged, updateScheduleState, updateTaskInRef],
  );

  const handleTaskDelete = useCallback(
    (event: any) => {
      const targetId = event?.id ?? event?.task?.id;

      if (targetId === undefined || targetId === null) {
        console.warn("Cannot delete task without id:", event);
        return;
      }

      currentTasksRef.current = currentTasksRef.current.filter((t) => !idsAreEqual(t.id, targetId));
      markAsChanged();
      updateScheduleState();
    },
    [markAsChanged, updateScheduleState],
  );

  const handleTaskMove = useCallback(
    (event: any) => {
      updateTaskInRef(event);
      markAsChanged();
      updateScheduleState();
    },
    [markAsChanged, updateScheduleState, updateTaskInRef],
  );

  const handleLinkAdd = useCallback(
    (event: any) => {
      const normalizedLink = toPlainLink(event);

      if (!normalizedLink || normalizedLink.id === undefined || normalizedLink.id === null) {
        console.warn("Cannot append link without id:", event);
        return;
      }

      const existingIndex = currentLinksRef.current.findIndex((link) => idsAreEqual(link.id, normalizedLink.id));
      if (existingIndex === -1) {
        currentLinksRef.current = [...currentLinksRef.current, normalizedLink];
      } else {
        const nextLinks = [...currentLinksRef.current];
        nextLinks[existingIndex] = {
          ...nextLinks[existingIndex],
          ...normalizedLink,
        };
        currentLinksRef.current = nextLinks;
      }

      markAsChanged();
      updateScheduleState();
    },
    [markAsChanged, updateScheduleState],
  );

  const handleLinkUpdate = useCallback(
    (event: any) => {
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
        const nextLinks = [...currentLinksRef.current];
        nextLinks[index] = { ...nextLinks[index], ...normalizedLink };
        currentLinksRef.current = nextLinks;
      }
      markAsChanged();
      updateScheduleState();
    },
    [markAsChanged, updateScheduleState],
  );

  const handleLinkDelete = useCallback(
    (event: any) => {
      const targetId = event?.id ?? event?.link?.id;

      if (targetId === undefined || targetId === null) {
        console.warn("Cannot delete link without id:", event);
        return;
      }

      currentLinksRef.current = currentLinksRef.current.filter((l) => !idsAreEqual(l.id, targetId));
      markAsChanged();
      updateScheduleState();
    },
    [markAsChanged, updateScheduleState],
  );

  const handlers = useMemo(
    () => ({
      onUpdateTask: handleTaskUpdate,
      onAddTask: handleTaskAdd,
      onDeleteTask: handleTaskDelete,
      onMoveTask: handleTaskMove,
      onAddLink: handleLinkAdd,
      onUpdateLink: handleLinkUpdate,
      onDeleteLink: handleLinkDelete,
    }),
    [handleLinkAdd, handleLinkDelete, handleLinkUpdate, handleTaskAdd, handleTaskDelete, handleTaskMove, handleTaskUpdate],
  );

  const initGantt = useCallback((api: any) => {
    apiRef.current = api;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/mock");

        if (response.ok) {
          const data = await response.json();

          const processedTasks = (data.tasks || []).map((task: any) => decorateTask(task));

          const nextSchedule: ScheduleData = {
            tasks: processedTasks,
            links: data.links || [],
            scales: data.scales || [],
          };

          setSchedule(nextSchedule);
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

  return {
    schedule,
    isLoading,
    saveState,
    hasChanges,
    handleSave,
    handlers,
    initGantt,
  };
};

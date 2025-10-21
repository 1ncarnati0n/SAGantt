import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("wx-react-gantt", () => ({
    Gantt: ({ tasks, links, scales, columns }: Record<string, unknown>) => (
        <div data-testid="gantt-stub">
            tasks:{(tasks as unknown[] | undefined)?.length ?? 0}-links:{(links as unknown[] | undefined)?.length ?? 0}-scales:{(scales as unknown[] | undefined)?.length ?? 0}-columns:{(columns as unknown[] | undefined)
                ?.map((column) => (column as { header?: string }).header)
                .join(",")}
        </div>
    ),
    Willow: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="willow-stub">{children}</div>
    ),
    defaultColumns: [
        { id: "text", header: "Task name" },
        { id: "start", header: "Start date" },
        { id: "duration", header: "Duration" },
        { id: "action", header: "" },
    ],
}));

import { GanttPreview } from "../../src/components/GanttPreview";

describe("GanttPreview", () => {
    it("renders heading and wires schedule to Gantt with localized columns", () => {
        render(<GanttPreview />);

        expect(screen.getByRole("heading", { name: "프로젝트 일정 프리뷰" })).toBeInTheDocument();
        expect(screen.getByTestId("willow-stub")).toBeInTheDocument();
        const stub = screen.getByTestId("gantt-stub");
        expect(stub).toHaveTextContent("tasks:6");
        expect(stub).toHaveTextContent("links:3");
        expect(stub).toHaveTextContent("scales:2");
        expect(stub).toHaveTextContent("columns:작업명,시작일,기간(일),");
    });
});

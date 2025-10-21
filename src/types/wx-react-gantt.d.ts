declare module "wx-react-gantt" {
    import * as React from "react";

    export interface GanttTask {
        id: number | string;
        text: string;
        start: Date;
        end?: Date;
        duration?: number;
        progress?: number;
        type?: string;
        parent?: number | string;
        lazy?: boolean;
        [key: string]: unknown;
    }

    export interface GanttLink {
        id: number | string;
        source: number | string;
        target: number | string;
        type?: string;
        [key: string]: unknown;
    }

    export interface GanttScale {
        unit: string;
        step: number;
        format: string | ((date: Date) => string);
        [key: string]: unknown;
    }

    export interface GanttColumn {
        id: string;
        header?: string;
        width?: number;
        flexgrow?: number;
        align?: string;
        sort?: boolean;
        [key: string]: unknown;
    }

    export interface GanttProps {
        tasks?: GanttTask[];
        links?: GanttLink[];
        scales?: GanttScale[];
        columns?: GanttColumn[];
        [key: string]: unknown;
    }

    export const Gantt: React.FC<GanttProps>;
    export const Willow: React.FC<React.PropsWithChildren>;
    export const defaultColumns: GanttColumn[];
}

declare module "wx-react-gantt/dist/gantt.css";

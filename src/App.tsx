import React from "react";

import { GanttPreview } from "./components/GanttPreview";

const App: React.FC = () => {
    return (
        <main>
            <h1>SVAR Gantt 기본 목업</h1>
            <p>
                React + SVAR Gantt
            </p>
            <GanttPreview />
        </main>
    );
};

export default App;

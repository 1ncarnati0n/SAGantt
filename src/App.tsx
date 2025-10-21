import React from "react";

import { GanttPreview } from "./components/GanttPreview";

const App: React.FC = () => {
    return (
        <main>
            <p>ConTech Gantt: In-Progress</p>
            <GanttPreview />
        </main>
    );
};

export default App;

import React from "react";

import type { SaveState, ViewType } from "./types";

interface GanttControlsProps {
  viewType: ViewType;
  onViewTypeChange: (viewType: ViewType) => void;
  showBaselines: boolean;
  onToggleBaselines: () => void;
  onSave: () => void;
  hasChanges: boolean;
  saveState: SaveState;
}

const VIEW_OPTIONS: Array<{ id: ViewType; label: string }> = [
  { id: "day", label: "일" },
  { id: "week", label: "주" },
  { id: "month", label: "월" },
];

export const GanttControls: React.FC<GanttControlsProps> = ({
  viewType,
  onViewTypeChange,
  showBaselines,
  onToggleBaselines,
  onSave,
  hasChanges,
  saveState,
}) => {
  return (
    <div className="mb-5 p-4 bg-gray-100 rounded">
      {VIEW_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => onViewTypeChange(option.id)}
          className={`btn btn-view ${viewType === option.id ? "active" : ""}`}
        >
          {option.label}
        </button>
      ))}
      <button
        onClick={onToggleBaselines}
        className={`btn btn-toggle ${showBaselines ? "active" : ""}`}
        aria-pressed={showBaselines}
      >
        계획 일정 {showBaselines ? "숨기기" : "표시"}
      </button>
      <button
        onClick={onSave}
        disabled={!hasChanges || saveState === "saving"}
        className="btn btn-save"
        title={`hasChanges: ${hasChanges}, saveState: ${saveState}`}
      >
        {saveState === "saving" ? "저장 중..." : "저장"}
      </button>
      <span className="ml-4 text-sm text-gray-600" role="status">
        {hasChanges && saveState === "idle" && "변경 사항이 있습니다."}
        {saveState === "saved" && "변경 내용이 mock.json에 저장되었습니다."}
        {saveState === "error" && "저장 실패 - 콘솔을 확인하세요."}
        <span className="ml-2 text-xs text-gray-400">(Debug: hasChanges={String(hasChanges)})</span>
      </span>
    </div>
  );
};

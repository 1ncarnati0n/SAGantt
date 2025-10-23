
## taskTemplate (작업 템플릿)

### Description (설명)
`taskTemplate` 속성은 **작업 막대(Task bar)**의 콘텐츠에 사용자 정의 템플릿(React 컴포넌트)을 적용할 수 있도록 정의합니다.

### Usage (사용법)
```ts
taskTemplate?: any;
```

### Parameters (매개변수)
- **taskTemplate**: 작업(Task) 막대의 콘텐츠에 적용할 React 컴포넌트(React component).

### Example 1 (예시 1)
다음 예시는 React의 `dispatch`를 사용하여 커스텀 클릭 액션(`custom-click`)을 Gantt로 전송하는 사용자 정의 컴포넌트를 보여줍니다.

```jsx
import React, { useState } from "react";

export default function SomeComponent({ data }) {
  const [clicked, setClicked] = useState(data.clicked);

  function doClick(ev) {
    ev.stopPropagation();
    setClicked(!clicked);
    // 커스텀 dispatch 로직 (예: Gantt로 액션 전달)
    // props.onAction({ action: "custom-click", data: { clicked: !clicked, id: data.id } });
  }

  return (
    <>
      {data.type !== "milestone" ? (
        <>
          <div className="wx-text-out text-right">{data.text || ""}</div>
          <button onClick={doClick}>
            {clicked ? "Was clicked" : "Click Me"}
          </button>
        </>
      ) : (
        <div className="wx-text-out text-left">{data.text || ""}</div>
      )}
    </>
  );
}
```

### Example 2 (예시 2)
다음 예시는 위의 컴포넌트를 Gantt에 불러와 `custom-click` 이벤트 발생 시 `update-task` 액션을 실행하는 방법을 보여줍니다.

```jsx
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import MyTaskContent from "../custom/MyTaskContent.jsx";
import { useRef } from "react";

function GanttComponent() {
  const data = getData();
  const apiRef = useRef();

  function doClick(ev) {
    const data = ev;
    apiRef.current.exec("update-task", {
      id: data.id,
      task: { clicked: data.clicked },
    });
  }

  return (
    <Gantt
      ref={apiRef}
      onCustomClick={doClick}
      taskTemplate={MyTaskContent}
      tasks={data.tasks}
      links={data.links}
      scales={data.scales}
    />
  );
}

export default GanttComponent;
```

### Styles (스타일 예시)
```css
button {
  font-size: 10px;
  position: relative;
  z-index: 2;
  font: var(--wx-gantt-bar-font);
}

.text-right {
  left: 100%;
  top: -2px;
}

.text-left {
  right: 100%;
  top: -2px;
}

.text-right,
.text-left,
button {
  padding: 0 2px;
  font-size: 12px;
}
```

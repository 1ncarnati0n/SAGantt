
## lengthUnit (작업 길이 단위)

### Description (설명)
`lengthUnit` 속성은 Gantt 차트에서 **작업 막대(Task bar)**의 최소 단위(길이)를 정의합니다.

### Usage (사용법)
```ts
lengthUnit?: "hour" | "day" | "week" | "month" | "quarter" | "year";
```

### Parameters (매개변수)
- **lengthUnit**: 차트에서 **작업 막대(Task bar)**의 최소 단위입니다.  
  이는 [`scales`](https://docs.svar.dev/react/gantt/api/properties/scales) 단위와 같거나 더 작아야 합니다.  
  가능한 값:
  - `"hour"` (시간)
  - `"day"` (일)
  - `"week"` (주)
  - `"month"` (월)
  - `"quarter"` (분기)
  - `"year"` (년)

### Example (예시)
```jsx
import { getData } from "./data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useRef } from "react";

function GanttComponent() {
  const data = getData();
  const lengthUnitRef = useRef("week");

  return (
    <Gantt
      tasks={data.tasks}
      lengthUnit={lengthUnitRef.current}
    />
  );
}

export default GanttComponent;
```

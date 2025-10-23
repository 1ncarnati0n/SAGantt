## highlightTime

### 설명 (Description)
`highlightTime`은 Gantt 차트 내에서 특정 시간 영역을 강조(Highlight)하기 위한 함수입니다.

---

### 사용법 (Usage)
```typescript
highlightTime?: (date: Date, unit: "day" | "hour") => string;
```

이 함수는 `date` (날짜)와 `unit` ("day" 또는 "hour")를 입력으로 받아, 해당 시간 단위를 시각적으로 강조하기 위한 CSS 클래스 이름을 반환합니다.

---

### 매개변수 (Parameters)
- **date** (`Date`): 하이라이트할 기준 날짜입니다.
- **unit** (`"day" | "hour"`): 단위 시간으로, `"day"` 또는 `"hour"` 중 하나를 지정합니다.
- **반환값 (Return value)**: 문자열 형태의 CSS 클래스 이름. 내장 클래스 `"wx-weekend"` 또는 사용자 정의 클래스명을 반환할 수 있습니다.

> 💡 참고:  
> `min.unit`이 `"day"`이면 각 날짜에 대해 호출되고, `"hour"`이면 각 시간 단위에 대해 호출됩니다.

---

### 예시 (Example)
다음 예시는 주말(`Saturday`, `Sunday`)과 특정 근무 시간 외의 시간대를 강조 표시하는 방법을 보여줍니다.

```jsx
import React from 'react';
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const GanttComponent = () => {
  const data = getData();
  const scales = [
    { unit: "year", step: 1, format: "yyyy" },
    { unit: "month", step: 2, format: "MMMM yyy" },
    { unit: "week", step: 1, format: "wo" },
    { unit: "day", step: 1, format: "d, EEEE" },
    { unit: "hour", step: 1, format: "HH:mm" },
  ];

  function isDayOff(date) {
    const d = date.getDay();
    return d === 0 || d === 6;
  }

  function isHourOff(date) {
    const h = date.getHours();
    return h < 8 || h === 12 || h > 17;
  }

  function highlightTime(d, u) {
    if (u === "day" && isDayOff(d)) return "wx-weekend";
    if (u === "hour" && (isDayOff(d) || isHourOff(d))) return "wx-weekend";
    return "";
  }

  return (
    <Gantt
      tasks={data.tasks}
      links={data.links}
      scales={scales}
      cellWidth={40}
      highlightTime={highlightTime}
    />
  );
};

export default GanttComponent;
```

---

### 관련 문서 (Related articles)
- [end Property](https://docs.svar.dev/react/gantt/api/properties/end)
- [lengthUnit Property](https://docs.svar.dev/react/gantt/api/properties/lengthUnit)

## scales | React Gantt Documentation

### 설명 (Description)
`scales` 속성은 **Gantt 차트의 시간 스케일(timescale)**을 정의합니다.  
이 속성은 시간 단위를 나타내는 **객체 배열(array of objects)** 형태로 구성됩니다.

### 사용법 (Usage)
```javascript
scales?: [
  {
    unit: string;
    step: number;
    format: string | (start: Date, end: Date) => string;
    css?: string | (start: Date) => string;
  },
  {...}
];
```

### 매개변수 (Parameters)
- **unit** *(required)* — 스케일 단위. 사용 가능한 값은 `"hour"`, `"day"`, `"week"`, `"month"`, `"quarter"`, `"year"` 입니다.  
- **step** *(required)* — 각 셀(cell)이 표현하는 단위 수를 정의합니다.  
- **format** *(required)* — 각 스케일 단위의 표시 형식을 정의합니다.  
  - 문자열 형태로 지정할 수 있으며, [`date-fns`](https://date-fns.org/v2.29.3/docs/format)에서 지원하는 형식을 따릅니다.  
  - 또는 사용자 지정 함수 형태로 지정할 수 있습니다. 이 함수는 `start`, `end` 두 개의 날짜(Date 객체)를 인자로 받아 문자열을 반환해야 합니다.  
- **css** *(optional)* — 스케일에 적용할 CSS 클래스.  
  - 문자열로 CSS 클래스 이름을 지정할 수 있으며,  
  - 또는 함수 형태로 지정해 날짜에 따라 다른 CSS 클래스를 반환할 수도 있습니다.

### 예제 (Example)
```javascript
import React from "react";
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const GanttComponent = ({ skinSettings }) => {
  const data = getData();

  const dayStyle = a => {
    const day = a.getDay() === 5 || a.getDay() === 6;
    return day ? "sday" : "";
  };

  const complexScales = [
    { unit: "year", step: 1, format: "yyyy" },
    { unit: "month", step: 2, format: "MMMM yyy" },
    { unit: "week", step: 1, format: "w" },
    { unit: "day", step: 1, format: "d", css: dayStyle },
  ];

  return (
    <Gantt
      {...skinSettings}
      tasks={data.tasks}
      links={data.links}
      scales={complexScales}
      start={new Date(2020, 2, 1)}
      end={new Date(2020, 3, 12)}
      cellWidth={60}
    />
  );
};

export default GanttComponent;
```

### 관련 문서 (Related Articles)
- [scaleHeight](https://docs.svar.dev/react/gantt/api/properties/scaleHeight) (이전)
- [selected](https://docs.svar.dev/react/gantt/api/properties/selected) (다음)

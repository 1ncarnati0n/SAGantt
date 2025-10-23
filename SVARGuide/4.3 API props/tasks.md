## tasks | React Gantt Documentation

### 설명 (Description)
`tasks` 속성은 **Gantt 차트 내의 작업(Task)** 데이터를 정의합니다.

### 사용법 (Usage)
```javascript
tasks?: [
  {
    id: string | number,
    // start는 필수이며, end 또는 duration 중 하나는 반드시 포함되어야 합니다.
    start: Date,
    end?: Date,
    duration?: number,
    text?: string,
    progress?: number,
    parent?: string | number,
    type?: "task" | "summary" | "milestone" | any, // 사용자 정의 타입 가능
    open?: boolean,
    lazy?: boolean,
    // Task의 baseline 관련 데이터
    base_start?: Date,
    base_end?: Date,
    base_duration?: number
  }
];
```

### 매개변수 (Parameters)
각 Task 객체는 다음의 매개변수를 가집니다:

- **id** *(required)* — 작업의 고유 ID  
- **start** *(required)* — 작업의 시작 날짜  
- **end** *(optional)* — 작업의 종료 날짜. `duration`과 함께 둘 다 지정해서는 안 됩니다.  
- **duration** *(optional)* — 작업 기간 (일 단위)  
- **base_start** *(required)* — baseline의 시작 날짜  
- **base_end** *(optional)* — baseline의 종료 날짜 (`base_duration`과 중복 지정 불가)  
- **base_duration** *(optional)* — baseline 기간 (일 단위)  
- **open** *(optional)* — `true`이면 서브태스크(subtask)가 있는 경우 기본적으로 열립니다.  
- **lazy** *(optional)* — `true`이면 자식 태스크를 **동적 로딩(lazy loading)** 방식으로 불러옵니다.  
- **text** *(optional)* — 작업의 이름(표시 텍스트)입니다. 지정되지 않으면 빈 문자열("")로 처리됩니다.  
- **progress** *(optional)* — 작업의 진행률(0~100 사이의 퍼센트 값)입니다.  
- **parent** *(optional)* — 상위(parent) 작업의 ID. 없을 경우 `0`으로 지정합니다.  
- **type** *(required)* — 작업의 유형: `"task"`, `"summary"`, `"milestone"` 또는 사용자 정의 타입.  

📘 **참고:**  
날짜 형식은 [`date-fns`](https://date-fns.org/) 라이브러리에서 지원하는 형식을 따라야 합니다.

### 예제 (Example)
```javascript
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import React, { useRef, useEffect } from "react";

const GanttComponent = () => {
  const { links, scales, columns } = getData();

  const tasks = [
    {
      id: 1,
      open: true,
      start: new Date(2020, 11, 6),
      duration: 8,
      text: "React Gantt Widget",
      progress: 60,
      type: "summary"
    },
    {
      id: 2,
      parent: 1,
      start: new Date(2020, 11, 6),
      duration: 4,
      text: "Lib-Gantt",
      progress: 80
    },
  ];

  return <Gantt tasks={tasks} links={links} scales={scales} columns={columns} />;
};

export default GanttComponent;
```

### 관련 문서 (Related Articles)
- [start](https://docs.svar.dev/react/gantt/api/properties/start) (이전)
- [taskTemplate](https://docs.svar.dev/react/gantt/api/properties/taskTemplate) (다음)

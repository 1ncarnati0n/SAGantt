## taskTypes | React Gantt Documentation

### 설명 (Description)
`taskTypes` 속성은 **Gantt 차트에서 사용되는 작업(Task) 유형 데이터를 정의하는 객체 배열(array of objects)**입니다.

### 사용법 (Usage)
```javascript
taskTypes?: [
  {
    id: string,
    label?: string
  }
];
```

### 매개변수 (Parameters)
- **id** *(required)* — 작업의 고유 ID. `"task"`, `"summary"`, `"milestone"` 또는 사용자 정의 타입(custom type)으로 지정할 수 있습니다.  
- **label** *(optional)* — 작업의 표시 이름(label)입니다.

### 예제 (Example)
```javascript
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import React from "react";

const App = () => {
  const data = getData();
  const taskTypes = [
    { id: "task", label: "Project Task" },
    { id: "summary", label: "Project" },
  ];

  return <Gantt tasks={data.tasks} taskTypes={taskTypes} />;
};

export default App;
```

📘 **추가 참고 (Additional Info):**  
사용자 정의 작업 타입(custom task type)을 추가하는 방법은  
[Adding a custom task type](https://docs.svar.dev/react/gantt/guides/configuration/add_custom_task) 문서를 참고하세요.

### 관련 문서 (Related Articles)
- [taskTemplate](https://docs.svar.dev/react/gantt/api/properties/taskTemplate) (이전)
- [zoom](https://docs.svar.dev/react/gantt/api/properties/zoom) (다음)

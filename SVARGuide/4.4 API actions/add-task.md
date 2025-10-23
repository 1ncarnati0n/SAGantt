## add-task

### 설명 (Description)
`add-task` 액션은 새로운 **작업(Task)** 을 추가할 때 발생합니다.

---

### 사용법 (Usage)
```typescript
"add-task": ({
  id?: string | number,
  target: string | number,
  task: object,
  mode: "before" | "after" | "child"
}) => boolean | void;
```

> 💡 **참고:**  
> 액션을 처리하기 위해서는 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

---

### 매개변수 (Parameters)
`add-task` 액션의 콜백(callback)은 다음과 같은 매개변수를 포함하는 객체를 받을 수 있습니다:

| 이름 | 타입 | 필수 여부 | 설명 |
|------|------|------------|------|
| `id` | string \| number | 선택 | 새 작업(Task)의 ID |
| `target` | string \| number | 필수 | 새 작업이 추가될 기준 작업의 ID (이 작업 앞 또는 뒤, 혹은 자식으로 추가됨) |
| `task` | object | 필수 | 작업 객체(Task object). 가능한 속성 목록은 [tasks](https://docs.svar.dev/react/gantt/api/properties/tasks) 참고 |
| `mode` | string | 필수 | 작업의 위치를 지정합니다. `"before"` = 이전, `"after"` = 이후, `"child"` = 자식 작업 |

---

### 예제 (Example)

#### 1️⃣ `api.exec()`를 사용하여 액션 실행
```javascript
import { getData } from "./common/data";
import { Gantt, Toolbar } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Button } from "wx-react-wx";
import { useRef } from "react";

function App() {
  const data = getData();
  const apiRef = useRef();

  function handleAdd() {
    if (apiRef.current) {
      apiRef.current.exec("add-task", { task: {} });
    }
  }

  return (
    <>
      <Toolbar>
        <Button type="primary" onClick={handleAdd}>Add task</Button>
      </Toolbar>
      <Gantt
        apiRef={apiRef}
        tasks={data.tasks}
        links={data.links}
        scales={data.scales}
        columns={data.columns}
      />
    </>
  );
}

export default App;
```

---

#### 2️⃣ `api.intercept()`를 사용하여 task 데이터 가로채기
```javascript
import React, { useState, useEffect, useRef } from 'react';
import { getData } from './common/data';
import { Gantt } from 'wx-react-gantt';

function GanttComponent() {
  const [task, setTask] = useState(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const data = getData();
    if (apiRef.current) {
      apiRef.current.intercept('add-task', data => {
        setTask(data.task);
      });
    }
  }, [apiRef]);

  return (
    <Gantt
      ref={apiRef}
      tasks={getData().tasks}
    />
  );
}

export default GanttComponent;
```

---

### 관련 문서 (Related articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)  
- [add-link](https://docs.svar.dev/react/gantt/api/actions/add-link)  
- [copy-task](https://docs.svar.dev/react/gantt/api/actions/copy-task)  


## selected (선택된 작업)

### Description (설명)
`selected` 속성은 **Gantt 차트(Gantt chart)**에서 선택된(Highlighted) 작업(Task)을 표시하는 데 사용됩니다.

### Usage (사용법)
```ts
selected?: number | string;
```

### Parameters (매개변수)
- **selected**: 선택된 작업(Task)의 ID 또는 ID 배열(Array of IDs).  
  여러 개의 작업을 동시에 선택할 경우 배열 형식으로 전달합니다.

### Example (예시)
아래 예시는 `1`, `2`, `3`번 작업을 선택된 상태로 설정하는 방법을 보여줍니다.

```jsx
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import React from "react";

const App = () => {
  const data = getData();

  return (
    <Gantt
      tasks={data.tasks}
      links={data.links}
      scales={data.scales}
      selected={[1, 2, 3]}
    />
  );
};

export default App;
```

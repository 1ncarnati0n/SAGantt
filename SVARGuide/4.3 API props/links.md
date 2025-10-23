
## links (작업 간 연결)

### Description (설명)
`links` 속성은 **Gantt 차트(Gantt chart)**에서 작업(Task) 간의 연결 관계를 정의합니다.  
각 연결은 객체(Object) 형태로 표현되며, 배열(Array)로 구성됩니다.

### Usage (사용법)
```ts
links?: [
  {
    id: string | number,
    source: string | number,
    target: string | number,
    type: "s2s" | "s2e" | "e2s" | "e2e"
  },
  {...}
];
```

### Parameters (매개변수)
- **id** *(필수)*: 링크의 고유 ID (link ID)  
- **source** *(필수)*: 시작 작업의 ID (source task ID)  
- **target** *(필수)*: 대상 작업의 ID (target task ID)  
- **type** *(필수)*: 연결 유형 (link type). 다음 값 중 하나를 가질 수 있습니다:  
  - `"e2s"` — **End-to-Start** (종료에서 시작)  
  - `"s2s"` — **Start-to-Start** (시작에서 시작)  
  - `"e2e"` — **End-to-End** (종료에서 종료)  
  - `"s2e"` — **Start-to-End** (시작에서 종료)

### Example (예시)
아래 예시는 여러 작업 간 링크를 정의하는 방법을 보여줍니다.

```jsx
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const { tasks, scales, columns } = getData();

const links = [
  { id: 1, source: 3, target: 4, type: "e2s" },
  { id: 2, source: 1, target: 2, type: "e2s" },
  { id: 21, source: 8, target: 1, type: "s2s" },
  { id: 22, source: 1, target: 6, type: "s2s" },
];

function App() {
  return <Gantt tasks={tasks} scales={scales} columns={columns} links={links} />;
}

export default App;
```


## start (시작 날짜)

### Description (설명)
`start` 속성은 **Gantt 차트(Gantt chart)**의 타임스케일(Time scale) 시작 날짜를 설정합니다.

### Usage (사용법)
```ts
start?: Date;
```

### Example (예시)
아래 예시는 타임스케일의 시작 날짜를 2023년 3월 1일로 설정하는 방법을 보여줍니다.

```jsx
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const App = () => {
  const data = getData();

  return (
    <Gantt
      tasks={data.tasks}
      start={new Date(2023, 2, 1)}
    />
  );
};

export default App;
```

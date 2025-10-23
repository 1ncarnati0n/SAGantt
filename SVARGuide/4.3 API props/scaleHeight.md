
## scaleHeight (타임스케일 높이)

### Description (설명)
`scaleHeight` 속성은 **Gantt 차트(Gantt chart)**의 **헤더 셀(Header cell)** 높이를 픽셀 단위로 정의합니다.

### Usage (사용법)
```ts
scaleHeight?: number;
```

### Parameters (매개변수)
- **scaleHeight**: 타임스케일(Time scale)의 높이를 픽셀(px) 단위로 지정합니다.  
  기본값은 `36`입니다.

### Example (예시)
아래 예시는 타임스케일의 높이를 `50px`로 설정하는 방법을 보여줍니다.

```jsx
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const App = () => {
  const data = getData();
  return <Gantt tasks={data.tasks} scaleHeight={50} />;
};

export default App;
```

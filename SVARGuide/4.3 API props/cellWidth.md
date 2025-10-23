## cellWidth | React Gantt Documentation

### 설명 (Description)
`cellWidth` 속성은 각 셀의 **픽셀 단위 너비(width)**를 정의합니다.

### 사용법 (Usage)
```javascript
cellWidth?: number;
```

### 매개변수 (Parameters)
- **cellWidth** — 셀의 너비를 픽셀 단위로 지정합니다. 기본값은 **100**입니다.

### 예제 (Example)
```javascript
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const Component = () => {
  const data = getData();
  return <Gantt tasks={data.tasks} cellWidth={90} />;
};

export default Component;
```

### 관련 문서 (Related Articles)
- [cellHeight](https://docs.svar.dev/react/gantt/api/properties/cellHeight) (이전)
- [columns](https://docs.svar.dev/react/gantt/api/properties/columns) (다음)

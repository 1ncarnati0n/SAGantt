## readonly | React Gantt Documentation

### 설명 (Description)
`readonly` 속성은 **Gantt 차트에서 데이터 변경을 방지(읽기 전용 모드 활성화)**하는 기능을 제공합니다.

### 사용법 (Usage)
```javascript
readonly?: boolean;
```

### 매개변수 (Parameters)
- **readonly** *(optional)* — `true`로 설정하면 Gantt 차트가 **읽기 전용(readonly) 모드**로 전환됩니다.  
  `false`로 설정하면 읽기 전용 모드가 **비활성화**됩니다. (기본값)

### 예제 (Example)
```javascript
import { getData } from "./data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const MyComponent = () => {
  const { scales, tasks, links } = getData();
  const readonly = true; // readonly mode is enabled

  return <Gantt tasks={tasks} scales={scales} links={links} readonly={readonly} />;
};

export default MyComponent;
```

### 관련 문서 (Related Articles)
- [links](https://docs.svar.dev/react/gantt/api/properties/links) (이전)
- [scaleHeight](https://docs.svar.dev/react/gantt/api/properties/scaleHeight) (다음)

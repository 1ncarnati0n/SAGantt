## end | React Gantt Documentation

### 설명 (Description)
`end` 속성은 **타임스케일의 종료 날짜(end date)**를 설정합니다.

### 사용법 (Usage)
```javascript
end?: Date;
```

### 예제 (Example)
```javascript
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

function GanttComponent() {
  const data = getData();

  return (
    <Gantt
      tasks={data.tasks}
      start={new Date(2022, 2, 1)}
      end={new Date(2023, 3, 1)}
      // other settings
    />
  );
}

export default GanttComponent;
```

### 관련 문서 (Related Articles)
- [editorShape](https://docs.svar.dev/react/gantt/api/properties/editorShape) (이전)
- [highlightTime](https://docs.svar.dev/react/gantt/api/properties/highlightTime) (다음)

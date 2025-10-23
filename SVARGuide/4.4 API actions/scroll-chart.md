## scroll-chart | React Gantt Documentation

### 설명 (Description)
`scroll-chart` 이벤트는 차트가 스크롤될 때 발생합니다.

### 사용법 (Usage)
```javascript
"scroll-chart": ({
  left?: number,
  top?: number
}) => boolean | void;
```

### 매개변수 (Parameters)
- **left** *(optional)* — 차트가 왼쪽으로 스크롤된 픽셀 수를 지정합니다.  
- **top** *(optional)* — 차트가 위쪽으로 스크롤된 픽셀 수를 지정합니다.

ℹ️ **참고:**  
이 액션을 처리하기 위해 [`Event Bus methods`](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

### 예제 (Example)
```javascript
import { useEffect, useRef } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const GanttComponent = () => {
  const data = getData();
  const apiRef = useRef();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("scroll-chart", ev => {
        console.log("The chart is scrolled");
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      apiRef={apiRef}
      tasks={data.tasks}
      // other settings
    />
  );
};

export default GanttComponent;
```

### 관련 문서 (Related Articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [request-data](https://docs.svar.dev/react/gantt/api/actions/request-data) (이전)
- [select-task](https://docs.svar.dev/react/gantt/api/actions/select-task) (다음)

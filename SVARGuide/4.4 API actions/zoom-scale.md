
## zoom-scale (확대/축소)

### Description (설명)
`zoom-scale` 액션은 **Gantt 차트(Gantt chart)**가 확대(zoom in) 또는 축소(zoom out)될 때 발생합니다.

### Usage (사용법)
```js
"zoom-scale": ({
  dir: number;
  date: Date;
  offset?: number;
}) => boolean | void;
```

### Parameters (매개변수)
이 액션의 콜백(callback)은 다음과 같은 속성을 가진 객체를 받을 수 있습니다:

- **dir** *(number, 필수)*: 확대/축소 방향 (direction of zooming)  
  - `1` = 확대 (zoom in)  
  - `-1` = 축소 (zoom out)
- **date** *(Date, 필수)*: 확대 중심으로 적용된 날짜 (center date of zoomed area).  
  `date-fns`에서 지원하는 형식을 사용해야 합니다.
- **offset** *(number, 선택)*: 페이지의 X축 기준 커서 위치(px 단위)

> 💡 참고: `zoom-scale` 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 처리할 수 있습니다.

### Example (예시)
아래 예시는 차트 확대/축소 시 콘솔 로그를 출력하는 방법을 보여줍니다:

```jsx
import { useEffect, useRef } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const GanttComponent = () => {
  const data = getData();
  const apiRef = useRef(null);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("zoom-scale", (ev) => {
        console.log("The chart was zoomed");
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

### Related Articles (관련 문서)
- [How to access Gantt API (Gantt API 접근 방법)](https://docs.svar.dev/react/gantt/api/how_to_access_api)

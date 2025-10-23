## render-data

### 설명 (Description)
`render-data` 액션은 **스크롤 시 데이터가 렌더링될 때** 발생합니다.

---

### 사용법 (Usage)
```typescript
"render-data": ({
  from: number,
  start: number,
  end: number
}) => boolean | void;
```

> 💡 **참고:**  
> 액션을 처리하기 위해서는 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

---

### 매개변수 (Parameters)

| 이름 | 타입 | 필수 여부 | 설명 |
|------|------|------------|------|
| `from` | number | ✅ | 보이는 행(Row)이 시작되는 픽셀 위치 |
| `start` | number | ✅ | 첫 번째로 보이는 행의 ID |
| `end` | number | ✅ | 현재 화면에 보이는 마지막 행의 ID |

---

### 예제 (Example)

```javascript
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useRef, useEffect } from "react";

const GanttComponent = () => {
  const apiRef = useRef(null);
  const data = getData();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("render-data", (ev) => {
        console.log("The ID of the last visible row", ev.end);
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt ref={apiRef} tasks={data.tasks} links={data.links} scales={data.scales} />
  );
};

export default GanttComponent;
```

---

### 관련 문서 (Related articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)  
- [provide-data](https://docs.svar.dev/react/gantt/api/actions/provide-data)  
- [request-data](https://docs.svar.dev/react/gantt/api/actions/request-data)  

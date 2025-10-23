## expand-scale

### 설명 (Description)
`expand-scale` 액션은 **차트(Chart)** 내의 스케일(Scale)이 전체 공간을 채우지 못했을 때, 스케일의 경계를 확장해야 할 경우 발생합니다.

---

### 사용법 (Usage)
```typescript
"expand-scale": ({
  minWidth: number,
  date?: Date,
  offset: number
}) => boolean | void;
```

> 💡 **참고:**  
> 액션을 처리하기 위해서는 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

---

### 매개변수 (Parameters)

| 이름 | 타입 | 필수 여부 | 설명 |
|------|------|------------|------|
| `minWidth` | number | ✅ | 스케일의 최소 너비 (픽셀 단위) |
| `date` | Date | 선택 | 줌(Zoom) 영역의 중심으로 적용되는 날짜. [date-fns](https://date-fns.org/)에서 지원하는 형식을 사용 |
| `offset` | number | 선택 | 페이지의 X축 기준으로 커서의 위치를 나타내는 픽셀 값 |

---

### 예제 (Example)

다음 예제는 스케일이 뷰포트(Viewport)보다 작을 때, `minWidth` 값을 출력합니다.

```javascript
import { useEffect, useRef } from "react";
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const MyGanttComponent = () => {
  const data = getData();
  const apiRef = useRef(null);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("expand-scale", (ev) => {
        console.log("Current scale minWidth", ev.minWidth);
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      apiRef={apiRef}
      tasks={data.tasks}
      links={data.links}
      scales={data.scales}
    />
  );
};

export default MyGanttComponent;
```

---

### 관련 문서 (Related articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)  
- [drag-task](https://docs.svar.dev/react/gantt/api/actions/drag-task)  
- [indent-task](https://docs.svar.dev/react/gantt/api/actions/indent-task)  

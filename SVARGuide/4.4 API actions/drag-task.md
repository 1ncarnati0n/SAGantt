## drag-task

### 설명 (Description)
`drag-task` 액션은 **작업(Task)** 이 드래그될 때 발생합니다.

---

### 사용법 (Usage)
```typescript
"drag-task": ({
  id: string | number,
  width?: number,
  left?: number,
  top?: number,
  inProgress?: boolean
}) => boolean | void;
```

> 💡 **참고:**  
> 액션을 처리하기 위해서는 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

---

### 매개변수 (Parameters)

| 이름 | 타입 | 필수 여부 | 설명 |
|------|------|------------|------|
| `id` | string \| number | ✅ | 드래그 중인 작업의 ID |
| `width` | number | 선택 | 드래그 중 작업의 너비가 변경된 픽셀 수 |
| `left` | number | 선택 | 작업이 왼쪽으로 이동한 픽셀 수 |
| `top` | number | 선택 | 작업이 위로 이동한 픽셀 수 |
| `inProgress` | boolean | 선택 | `true`인 경우 드래그가 진행 중임을 나타내며, `false`는 드래그가 완료되었음을 의미 |

---

### 예제 (Example)

```javascript
import React, { useRef, useEffect } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const App = () => {
  const apiRef = useRef();
  const data = getData();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("drag-task", ev => {
        console.log("The id of the dragged task:", ev.id);
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      ref={apiRef}
      tasks={data.tasks}
      links={data.links}
      // other settings
    />
  );
};

export default App;
```

---

### 관련 문서 (Related articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)  
- [delete-task](https://docs.svar.dev/react/gantt/api/actions/delete-task)  
- [expand-scale](https://docs.svar.dev/react/gantt/api/actions/expand-scale)  

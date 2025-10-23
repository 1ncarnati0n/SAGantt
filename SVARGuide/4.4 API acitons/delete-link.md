## delete-link

### 설명 (Description)
`delete-link` 액션은 **링크(Link)** 가 삭제될 때 발생합니다.

---

### 사용법 (Usage)
```typescript
"delete-link": ({
  id: string | number;
}) => boolean | void;
```

> 💡 **참고:**  
> 액션을 처리하기 위해서는 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

---

### 매개변수 (Parameters)

| 이름 | 타입 | 필수 여부 | 설명 |
|------|------|------------|------|
| `id` | string \| number | ✅ | 삭제될 링크의 ID |

---

### 예제 (Example)

```javascript
import { useEffect, useRef } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const data = getData();

function GanttComponent() {
  const apiRef = useRef();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("delete-link", (ev) => {
        console.log("The id of the deleted link:", ev.id);
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      apiRef={apiRef}
      tasks={data.tasks}
      links={data.links}
      // other settings
    />
  );
}

export default GanttComponent;
```

---

### 관련 문서 (Related articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)  
- [copy-task](https://docs.svar.dev/react/gantt/api/actions/copy-task)  
- [delete-task](https://docs.svar.dev/react/gantt/api/actions/delete-task)  

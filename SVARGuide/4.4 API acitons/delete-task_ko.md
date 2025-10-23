## delete-task

### 설명 (Description)

`delete-task` 액션은 **task가 삭제될 때(fires when deleting a task)** 발생하는 이벤트입니다.  
이 이벤트는 Gantt의 **Event Bus**를 통해 감지할 수 있습니다.

---

### 사용법 (Usage)

```typescript
"delete-task": ({
  id: string | number,
  source?: string | number
}) => boolean | void;
```

이 콜백은 특정 task가 삭제될 때 트리거됩니다.

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string or number | ✅ 필수 | 삭제될 task의 고유 ID |
| `source` | string or number | 선택 | 삭제를 트리거한 원본 task의 ID |

> 💡 참고: 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용하여 핸들링할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `api.exec()` 메서드를 사용하여 `delete-task` 액션을 실행하는 방법을 보여줍니다.

```javascript
import { useRef, useState } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Button } from "wx-react-wx";

function App() {
  const data = getData();
  const apiRef = useRef();
  const [selected, setSelected] = useState();

  function handleDelete() {
    apiRef.current.exec("delete-task", { id: selected });
  }

  return (
    <>
      <Toolbar>
        {selected && <Button onClick={handleDelete}>Delete task</Button>}
      </Toolbar>

      <Gantt
        ref={apiRef}
        tasks={data.tasks}
        // 기타 설정
      />
    </>
  );
}

export default App;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [delete-link](https://docs.svar.dev/react/gantt/api/actions/delete-link)
- [drag-task](https://docs.svar.dev/react/gantt/api/actions/drag-task)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

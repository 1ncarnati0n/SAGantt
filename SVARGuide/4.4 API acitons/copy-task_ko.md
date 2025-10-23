## copy-task

### 설명 (Description)

`copy-task` 액션은 **task를 복사(copy)** 할 때 발생하는 이벤트입니다.  
이 이벤트는 Gantt의 **Event Bus**를 통해 감지할 수 있습니다.

---

### 사용법 (Usage)

```typescript
"copy-task": ({
  id: string | number,
  target?: string | number,
  eventSource?: string,
  mode?: string,
  source?: string | number,
  lazy?: boolean
}) => boolean | void;
```

이 콜백은 task 복사 작업이 발생할 때 트리거됩니다.

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string or number | ✅ 필수 | 새로 복사된 task의 고유 ID |
| `target` | string or number | 선택 | 복사된 task가 추가될 대상 task의 ID (`before` 또는 `after` 위치 지정 가능) |
| `source` | string or number | 선택 | 복사의 원본이 되는 task의 ID |
| `eventSource` | string | 선택 | `"copy-task"` 액션을 트리거한 액션의 이름 |
| `mode` | string | 선택 | task의 복사 위치를 지정 (`before` 또는 `after`) |
| `lazy` | boolean | 선택 | 하위 task를 서버(backend)에서 복사해야 하는지를 지정 |

#### `lazy` 파라미터 설명

- 복사되는 task가 **lazy 모드**(`lazy: true`)로 표시되어 있고,  
  아직 백엔드에서 하위 task들이 로드되지 않았다면 `true`로 설정됩니다.  
  → 이 경우 하위 task 복사는 **백엔드에서 수행**됩니다.

- 반대로, 클라이언트 데이터에 이미 하위 task가 포함되어 있다면 `false`로 설정되어,  
  복사는 **클라이언트 측**에서 수행됩니다.

> 💡 참고: 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 핸들링할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `api.on()`을 사용하여 `copy-task` 이벤트를 감지하고,  
복사된 task의 ID를 콘솔에 출력하는 방법을 보여줍니다.

```javascript
import { useEffect, useRef } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const MyGanttComponent = () => {
  const data = getData();
  const apiRef = useRef(null);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("copy-task", (ev) => {
        console.log("The id of the copied task:", ev.id);
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      ref={apiRef}
      tasks={data.tasks}
      // 기타 설정
    />
  );
};

export default MyGanttComponent;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [add-task](https://docs.svar.dev/react/gantt/api/actions/add-task)
- [delete-link](https://docs.svar.dev/react/gantt/api/actions/delete-link)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

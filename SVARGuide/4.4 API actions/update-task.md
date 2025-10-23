## update-task

### 설명 (Description)

`update-task` 액션은 **task가 업데이트될 때 발생하는 이벤트**입니다.  
이 이벤트는 task 데이터 변경, 날짜 조정, 상태 변경 등의 상황에서 실행됩니다.

---

### 사용법 (Usage)

```typescript
"update-task": ({
  id: string | number,
  task: object,
  diff?: number,
  inProgress?: boolean,
  eventSource?: string
}) => boolean | void;
```

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string / number | ✅ 필수 | 업데이트할 task의 ID |
| `task` | object | ✅ 필수 | 업데이트할 task 객체. 세부 필드는 [tasks](https://docs.svar.dev/react/gantt/api/properties/tasks) 참조 |
| `level` | number | ✅ 필수 | task가 트리 구조 내에서 위치하는 depth 수준 |
| `data` | array | ❌ 선택 | 하위 task의 배열 (각 항목은 동일한 task 속성 구조를 가짐) |
| `key` | string | ✅ 필수 | task 속성 필드 이름 (예: text, duration, progress 등) |
| `diff` | number | ❌ 선택 | 시작 및 종료 날짜의 변경 단위(기간) |
| `inProgress` | boolean | ❌ 선택 | true일 경우, task 업데이트가 진행 중임을 나타냄 |
| `eventSource` | string | ❌ 선택 | 업데이트를 트리거한 액션 이름 |

> 💡 참고: 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 관리할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `show-editor` 이벤트 발생 시 task의 `text` 필드를 초기화하는 예제입니다.

```jsx
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useRef } from "react";

function MyComponent() {
  const data = getData();
  const apiRef = useRef();

  function clearTaskText() {
    apiRef.current.exec("update-task", {
      id: 3,
      task: { text: "" }
    });
  }

  return (
    <Gantt
      apiRef={apiRef}
      tasks={data.tasks}
      onShowEditor={clearTaskText}
    />
  );
}

export default MyComponent;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [update-link](https://docs.svar.dev/react/gantt/api/actions/update-link)
- [zoom-scale](https://docs.svar.dev/react/gantt/api/actions/zoom-scale)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

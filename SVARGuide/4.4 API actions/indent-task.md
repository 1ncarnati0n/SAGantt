## indent-task

### 설명 (Description)

`indent-task` 액션은 **task를 들여쓰기(indenting)할 때** 발생합니다.  
이 이벤트는 Gantt의 **Event Bus**를 통해 감지할 수 있습니다.

---

### 사용법 (Usage)

```typescript
"indent-task": ({
  id: string | number,
  mode: boolean
}) => boolean | void;
```

이 액션은 특정 task가 들여쓰기되거나 계층 구조가 변경될 때 호출됩니다.

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string or number | ✅ 필수 | 들여쓰기 대상 task의 ID |
| `mode` | boolean | 선택 | `true`이면 해당 task는 바로 위 task의 **하위(child)** 로 변경됩니다 |

> 💡 참고: 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용하여 처리할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `api.exec()`을 사용하여 `indent-task` 액션을 직접 실행하는 방법을 보여줍니다.

```javascript
import React, { useRef, useEffect } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const App = () => {
  const data = getData();
  const apiRef = useRef(null);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.exec("indent-task", {
        id: 3,
        mode: true,
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      apiRef={apiRef}
      tasks={data.tasks}
      // 기타 설정
    />
  );
};

export default App;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [expand-scale](https://docs.svar.dev/react/gantt/api/actions/expand-scale)
- [move-task](https://docs.svar.dev/react/gantt/api/actions/move-task)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

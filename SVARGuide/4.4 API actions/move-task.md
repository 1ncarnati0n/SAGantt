## move-task

### 설명 (Description)
`move-task` 액션은 **작업(Task)** 이 이동될 때 발생합니다.

---

### 사용법 (Usage)
```typescript
"move-task": ({
  id: string | number,
  mode: string,
  target?: string | number,
  source?: string | number,
  inProgress?: boolean
}) => boolean | void;
```

> 💡 **참고:**  
> 액션을 처리하기 위해서는 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

---

### 매개변수 (Parameters)

| 이름 | 타입 | 필수 여부 | 설명 |
|------|------|------------|------|
| `id` | string \| number | ✅ | 이동되는 작업의 ID |
| `mode` | string | ✅ | 작업이 이동되는 방향 또는 위치를 지정합니다. |
| `target` | string \| number | 선택 | 현재 작업을 이동시킬 대상 작업의 ID |
| `source` | string \| number | 선택 | 이동 중인 원본 작업의 ID |
| `inProgress` | boolean | 선택 | `true`는 드래그 중임을 의미하고, `false`는 드래그가 완료되었음을 의미 |

**`mode`의 가능한 값:**  
- `up` — 위로 이동  
- `down` — 아래로 이동  
- `before` — 지정된 작업 앞에 이동  
- `after` — 지정된 작업 뒤에 이동  
- `child` — 지정된 작업의 하위로 이동  

---

### 예제 (Example)

`api.exec()` 메서드를 사용하여 `move-task` 액션을 트리거할 수 있습니다.

```javascript
import React, { useState, useRef } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Button } from "wx-react-wx";

const App = () => {
  const data = getData();
  const apiRef = useRef();
  const [selected, setSelected] = useState(null);

  const handleMove = (mode) => {
    apiRef.current.exec("move-task", { id: selected, mode });
  };

  return (
    <>
      <Toolbar>
        {selected && (
          <Button
            type="primary"
            onClick={() => {
              handleMove("up");
            }}
          >
            Move task up
          </Button>
        )}
      </Toolbar>
      <Gantt
        apiRef={apiRef}
        tasks={data.tasks}
        // other settings
      />
    </>
  );
};

export default App;
```

---

### 관련 문서 (Related articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)  
- [indent-task](https://docs.svar.dev/react/gantt/api/actions/indent-task)  
- [open-task](https://docs.svar.dev/react/gantt/api/actions/open-task)  

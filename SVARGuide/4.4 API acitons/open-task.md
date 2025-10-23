## open-task

### 설명 (Description)
`open-task` 액션은 **작업(Task)** 브랜치가 확장될 때 발생합니다.

---

### 사용법 (Usage)
```typescript
"open-task": ({
  id: string | number,
  mode: boolean
}) => boolean | void;
```

> 💡 **참고:**  
> 액션을 처리하기 위해서는 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

---

### 매개변수 (Parameters)

| 이름 | 타입 | 필수 여부 | 설명 |
|------|------|------------|------|
| `id` | string \| number | ✅ | 작업의 ID |
| `mode` | boolean | ✅ | 작업 브랜치의 확장 여부를 정의합니다. `true`일 경우 브랜치를 열고, `false`일 경우 닫습니다 (기본값은 `false`). |

---

### 예제 (Example)

```javascript
import React, { useEffect, useRef } from "react";
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const MyComponent = () => {
  const data = getData();
  const apiRef = useRef();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.exec("open-task", {
        id: 3,
        mode: true,
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      api={apiRef}
      tasks={data.tasks}
      links={data.links}
      // other settings
    />
  );
};

export default MyComponent;
```

---

### 관련 문서 (Related articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)  
- [move-task](https://docs.svar.dev/react/gantt/api/actions/move-task)  
- [provide-data](https://docs.svar.dev/react/gantt/api/actions/provide-data)  

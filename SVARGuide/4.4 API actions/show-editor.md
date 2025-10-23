## show-editor

### 설명 (Description)

`show-editor` 액션은 **특정 task에 대한 편집기(Editor) 다이얼로그가 열릴 때** 발생합니다.  
이 이벤트는 task 수정 이벤트를 감지하거나, 기본 편집창을 사용자 정의 UI로 교체할 때 활용할 수 있습니다.

---

### 사용법 (Usage)

```typescript
"show-editor": ({
  id: string | number
}) => boolean | void;
```

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string or number | ✅ 필수 | 편집기(Editor) 다이얼로그를 열어야 하는 task의 ID |

> 💡 참고: 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 처리할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `api.intercept()`를 사용하여 **기본 편집 다이얼로그를 비활성화(false 반환)** 하는 방법을 보여줍니다.

```jsx
import { useEffect, useRef } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const MyComponent = () => {
  const data = getData();
  const apiRef = useRef();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.intercept("show-editor", (data) => {
        return false; // 기본 에디터 표시를 차단
      });
    }
  }, [apiRef.current]);

  return <Gantt apiRef={apiRef} tasks={data.tasks} />;
};

export default MyComponent;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [select-task](https://docs.svar.dev/react/gantt/api/actions/select-task)
- [sort-tasks](https://docs.svar.dev/react/gantt/api/actions/sort-tasks)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

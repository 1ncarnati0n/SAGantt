## select-task

### 설명 (Description)

`select-task` 액션은 **task를 선택할 때 발생하는 이벤트**입니다.  
이 이벤트는 특정 task를 선택, 토글(toggle), 범위 선택(range) 또는 자동 스크롤(scroll) 동작과 함께 사용할 수 있습니다.

---

### 사용법 (Usage)

```typescript
"select-task": ({
  id: string | number,
  toggle?: boolean,
  range?: boolean,
  show?: boolean,
}) => boolean | void;
```

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string / number | ✅ 필수 | 선택된 task의 ID |
| `toggle` | boolean | ❌ 선택 | `true`일 경우 선택 상태를 토글(toggle) 가능. GUI에서 **Ctrl + 클릭**으로 토글 |
| `range` | boolean | ❌ 선택 | `true`일 경우 범위 선택 가능. GUI에서 **Shift + 클릭**으로 첫 선택부터 지정된 task까지 선택 |
| `show` | boolean | ❌ 선택 | `true`일 경우 선택된 task로 자동 스크롤 |

> 💡 참고: 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 처리할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `select-task` 이벤트를 감지하고 선택된 task의 ID를 콘솔에 출력하는 코드입니다.

```jsx
import React, { useRef, useEffect } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const GanttComponent = () => {
  const data = getData();
  const apiRef = useRef(null);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("select-task", ev => {
        console.log("The id of the selected task:", ev.id);
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

export default GanttComponent;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [scroll-chart](https://docs.svar.dev/react/gantt/api/actions/scroll-chart)
- [show-editor](https://docs.svar.dev/react/gantt/api/actions/show-editor)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

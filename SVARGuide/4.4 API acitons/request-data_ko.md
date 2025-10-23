## request-data

### 설명 (Description)

`request-data` 액션은 **특정 task의 하위 브랜치(branch) 데이터가 요청될 때** 발생합니다.  
이 이벤트는 서버에서 데이터를 비동기로 불러와야 할 때 유용하게 사용됩니다.

---

### 사용법 (Usage)

```typescript
"request-data": ({
  id: string
}) => boolean | void;
```

이 액션은 `id`로 지정된 task의 데이터를 요청할 때 자동으로 실행됩니다.

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | ✅ 필수 | 데이터 요청 대상이 되는 task의 ID |

> 💡 참고: 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 처리할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `request-data` 이벤트를 감지하고 콘솔에 해당 task의 ID를 출력하는 방법을 보여줍니다.

```jsx
import { useEffect, useRef } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const GanttComponent = () => {
  const apiRef = useRef();
  const data = getData();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("request-data", ({ id }) => {
        console.log("Data request for: " + id);
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

export default GanttComponent;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [render-data](https://docs.svar.dev/react/gantt/api/actions/render-data)
- [scroll-chart](https://docs.svar.dev/react/gantt/api/actions/scroll-chart)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

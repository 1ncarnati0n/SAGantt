## add-link

### 설명 (Description)

`add-link` 액션은 새로운 **link**가 추가될 때 발생합니다.  
이 이벤트는 **Gantt** 컴포넌트 내의 **Event Bus**를 통해 감지할 수 있습니다.

---

### 사용법 (Usage)

```typescript
"add-link": ({
  id?: string | number,
  link: object
}) => boolean | void;
```

이 액션은 새 링크가 생성될 때 트리거되며, 선택적으로 `id`를 포함할 수 있습니다.

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string or number | 선택 | 자동 생성된 링크의 ID |
| `link` | object | ✅ 필수 | 링크 객체로, 다음 속성을 포함함 |

#### `link` 객체의 속성

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `source` | number | ✅ | 연결의 시작 task ID |
| `target` | number | ✅ | 연결의 대상 task ID |
| `type` | string | ✅ | 링크 유형 — 가능한 값은 아래와 같음: |

- `e2s` → End-to-Start  
- `s2s` → Start-to-Start  
- `e2e` → End-to-End  
- `s2e` → Start-to-End  

> 💡 **참고:** 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 핸들링할 수 있습니다.

---

### 예시 (Example)

아래 예시에서는 `api.intercept()` 메서드를 사용하여 `add-link` 이벤트에서 전달된 데이터를 가로채고,  
해당 데이터를 React의 state에 저장하는 방식을 보여줍니다.

```javascript
import { useEffect, useRef, useState } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const SomeComponent = () => {
  const data = getData();
  const [link, setLink] = useState(null);
  const apiRef = useRef(null);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("add-link", (data) => {
        setLink(data.link);
      });
    }
  }, [apiRef.current]);

  return (
    <Gantt
      ref={apiRef}
      tasks={data.tasks}
      links={data.links}
      // 기타 설정
    />
  );
};

export default SomeComponent;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [Actions Overview](https://docs.svar.dev/react/gantt/api/overview/actions_overview)
- [add-task](https://docs.svar.dev/react/gantt/api/actions/add-task)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.

## provide-data

### 설명 (Description)

`provide-data` 액션은 **특정 브랜치(branch)에 새로운 데이터(tasks, links 등)** 를 제공할 때 호출됩니다.  
이 액션은 주로 서버에서 데이터를 가져와 특정 task의 하위 데이터(branch data)를 Gantt에 제공할 때 사용됩니다.

---

### 사용법 (Usage)

```typescript
"provide-data": ({
  id: string | number,
  data: {
    tasks?: [],
    links?: []
  }
}) => boolean | void;
```

이 액션은 `id`로 지정된 task에 대해 새로운 데이터(`tasks`, `links`)를 전달합니다.

---

### 파라미터 (Parameters)

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string or number | ✅ 필수 | 데이터를 제공할 task의 ID |
| `data` | object | ✅ 필수 | 제공할 데이터 객체로, `tasks` 및 `links` 배열을 포함합니다 |

> 💡 참고: 이 액션은 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 통해 처리할 수 있습니다.

---

### 예시 (Example)

아래 예시는 `request-data` 액션을 수신한 후 서버에서 데이터를 가져와 `provide-data` 액션으로 전달하는 방식입니다.

```jsx
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useState, useEffect, useRef } from "react";

const server = "https://some-server";

function GanttComponent() {
  const [tasks, setTasks] = useState([]);
  const [links, setLinks] = useState([]);
  const apiRef = useRef();

  useEffect(() => {
    Promise.all([
      fetch(server + "/tasks").then(res => res.json()),
      fetch(server + "/links").then(res => res.json()),
    ]).then(([t, l]) => {
      setTasks(t);
      setLinks(l);
    });
  }, []);

  const init = (api) => {
    api.on("request-data", ev => {
      Promise.all([
        fetch(server + `/tasks/${ev.id}`).then(res => res.json()),
        fetch(server + `/links/${ev.id}`).then(res => res.json()),
      ]).then(([tasks, links]) => {
        api.exec("provide-data", {
          id: ev.id,
          data: { tasks, links },
        });
      });
    });
  };

  return <Gantt apiRef={apiRef} init={init} tasks={tasks} links={links} />;
}

export default GanttComponent;
```

---

### 관련 문서 (Related articles)

- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [request-data](https://docs.svar.dev/react/gantt/api/actions/request-data)
- [render-data](https://docs.svar.dev/react/gantt/api/actions/render-data)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  
모든 제품 및 회사명은 해당 소유자의 상표일 수 있습니다.


## sort-tasks (작업 정렬)

### Description (설명)
`sort-tasks` 액션은 **작업(Task)**이 정렬될 때 발생합니다.

### Usage (사용법)
```js
"sort-tasks": ({
  key: string,
  order: "asc" | "desc"
}) => boolean | void;
```

### Parameters (매개변수)
이 액션의 콜백(callback)은 다음과 같은 속성을 가진 객체를 받을 수 있습니다:

- **key** *(string, 필수)*: 정렬할 데이터 필드 이름 (data field name)
- **order** *("asc" | "desc", 필수)*: 정렬 방향 (sorting direction)

> 💡 참고: `sort-tasks` 액션을 처리하려면 [Event Bus methods](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

### Example (예시)
다음 예시는 `text` 필드에 대해 정렬을 활성화하는 방법을 보여줍니다:

```jsx
import React, { useRef, useEffect } from "react";
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

export default function GanttComponent() {
  const data = getData();
  const apiRef = useRef();

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.intercept("sort-tasks", (config) => {
        return config.key === "text";
      });
    }
  }, [apiRef]);

  return <Gantt apiRef={apiRef} tasks={data.tasks} links={data.links} />;
}
```

### Related Articles (관련 문서)
- [columns (컬럼)](https://docs.svar.dev/react/gantt/api/properties/columns)
- [How to access Gantt API (Gantt API 접근 방법)](https://docs.svar.dev/react/gantt/api/how_to_access_api)

## update-link | React Gantt Documentation

### 설명 (Description)
`update-link` 이벤트는 링크가 업데이트될 때 발생합니다.

### 사용법 (Usage)
```javascript
"update-link": ({
  id: string | number,
  link: any
}) => boolean | void;
```

### 매개변수 (Parameters)
콜백 함수는 다음과 같은 매개변수를 가진 객체를 인자로 받을 수 있습니다:

- **id** *(required)* — 링크의 고유 ID  
- **link** *(required)* — 링크 데이터 객체:
  - **source** *(required)* — 소스(Task) ID  
  - **target** *(required)* — 타깃(Task) ID  
  - **type** *(required)* — 링크 유형 (가능한 값):
    - `0` — End-to-start  
    - `1` — Start-to-start  
    - `2` — End-to-end  
    - `3` — Start-to-end  

ℹ️ **참고:**  
이 액션을 처리하기 위해 [`Event Bus methods`](https://docs.svar.dev/react/gantt/api/overview/methods_overview)를 사용할 수 있습니다.

### 예제 (Example)
아래 예제에서는 버튼 클릭 시 `api.exec` 메서드를 사용해 `update-link` 액션을 트리거합니다.

```javascript
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Button } from "wx-react-wx";
import { useRef } from "react";

const App = () => {
  const data = getData();
  const apiRef = useRef();

  const updateLink = () => {
    apiRef.current.exec("update-link", {
      id: 1,
      link: { type: 3 },
    });
  };

  return (
    <>
      <Button onClick={updateLink} type="primary">Update Link</Button>
      <Gantt
        ref={apiRef}
        tasks={data.tasks}
        links={data.links}
        // other settings
      />
    </>
  );
};

export default App;
```

### 관련 문서 (Related Articles)
- [How to access Gantt API](https://docs.svar.dev/react/gantt/api/how_to_access_api)
- [sort-tasks](https://docs.svar.dev/react/gantt/api/actions/sort-tasks) (이전)
- [update-task](https://docs.svar.dev/react/gantt/api/actions/update-task) (다음)

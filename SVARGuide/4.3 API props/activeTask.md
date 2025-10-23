# activeTask

이 문서는 **React Gantt API**의 `activeTask` 속성(Property)에 대한 설명입니다.  
전문 용어(예: Property, ID, Editor dialog 등)는 영어 그대로 유지하고, 설명은 한국어로 번역하였습니다.

---

## 📝 Description

`activeTask`는 **Editor dialog**가 열려 있는 **활성 task(active task)**를 정의하는 속성입니다.  
즉, Gantt 컴포넌트 초기화 시 특정 task를 선택된 상태로 표시하고, 해당 task의 Editor dialog를 자동으로 엽니다.

---

## ⚙️ Usage

```ts
activeTask?: number | string;
```

### Parameters

| 파라미터 | 설명 |
|:--|:--|
| **activeTask** | Editor dialog가 열릴 활성 task의 **ID** (숫자 또는 문자열) |

> 🧠 참고:  
> Gantt 컴포넌트가 초기화될 때 `activeTask`로 지정한 task ID가 자동으로 선택됩니다.

---

## 💡 Example

아래 예제에서는 `activeTask` 속성을 사용하여 ID가 4인 task가 자동으로 활성화되도록 설정합니다.

```jsx
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const data = getData();

function App() {
  return <Gantt tasks={data.tasks} activeTask={4} />;
}

export default App;
```

이 코드에서:
- `activeTask={4}`로 설정하면, ID가 4인 task가 자동으로 선택됩니다.  
- 해당 task에 대한 **Editor dialog**가 초기 렌더링 시 즉시 표시됩니다.

---

## 🔗 Related Articles

- [Gantt Properties Overview](https://docs.svar.dev/react/gantt/api/overview/properties_overview)  
- [baselines](https://docs.svar.dev/react/gantt/api/properties/baselines)

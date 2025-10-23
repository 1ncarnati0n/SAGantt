# cellHeight

이 문서는 **React Gantt API**의 `cellHeight` 속성(Property)에 대한 설명입니다.  
전문 용어(예: Property, pixel, cell 등)는 영어 그대로 유지하고, 설명은 한국어로 번역하였습니다.

---

## 📝 Description

`cellHeight` 속성은 **Gantt chart** 내 각 셀(cell)의 높이를 **pixel 단위**로 정의합니다.  
기본적으로 Gantt의 각 행(row)은 일정한 높이를 가지며, 이 속성을 통해 사용자 지정 높이로 조정할 수 있습니다.

---

## ⚙️ Usage

```ts
cellHeight?: number;
```

### 기본값 (Default)
> `38px`

즉, 지정하지 않을 경우 각 셀의 높이는 기본적으로 38픽셀로 설정됩니다.

---

## 💡 Example

아래 예제는 Gantt의 셀 높이를 `32px`로 조정하는 방법을 보여줍니다.

```jsx
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const App = () => {
  const data = getData();
  return <Gantt tasks={data.tasks} cellHeight={32} />;
};

export default App;
```

### 🧠 작동 방식
- `cellHeight`는 Gantt chart의 각 task row의 높이를 지정합니다.  
- 값이 작을수록 Gantt 차트가 더 많은 행을 한 화면에 표시할 수 있습니다.  
- 값이 클수록 각 task bar 간 간격이 넓어져 시각적 여유가 생깁니다.

---

## 🔗 Related Articles

- [cellBorders](https://docs.svar.dev/react/gantt/api/properties/cellBorders)  
- [cellWidth](https://docs.svar.dev/react/gantt/api/properties/cellWidth)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  

모든 제품명과 회사명은 해당 소유자의 상표일 수 있습니다.

# cellBorders

이 문서는 **React Gantt API**의 `cellBorders` 속성(Property)에 대한 설명입니다.  
전문 용어(예: Property, grid, horizontal line, column 등)는 영어 그대로 유지하고, 설명은 한국어로 번역하였습니다.

---

## 📝 Description

`cellBorders`는 **Gantt chart**의 셀 경계선(border) 스타일을 정의하는 속성입니다.  
이를 통해 Gantt의 grid 내에 표시되는 **수평선(horizontal)** 및 **수직선(vertical)** 을 표시하거나 숨길 수 있습니다.

---

## ⚙️ Usage

```ts
cellBorders?: string;
```

### Parameters

| 파라미터 | 설명 |
|:--|:--|
| **cellBorders** | Gantt grid의 라인 표시 방식을 지정합니다. |

#### 가능한 값(Value)

| 값 | 설명 |
|:--|:--|
| `"full"` | 모든 선(수평선 + 수직선)을 표시합니다. |
| `"columns"` | 수평선은 숨기고, **열(column)** 구분선만 표시합니다. |

> 💡 참고:  
> 이 속성을 사용하면 차트의 가독성을 높이거나 디자인 요구사항에 따라 grid 표시를 조정할 수 있습니다.

---

## 💡 Example

아래 예시는 `cellBorders` 속성을 `"columns"`로 설정하여 수평선을 숨기고, 세로 구분선만 표시하는 예시입니다.

```jsx
import { getData, simpleColumns } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const GanttComponent = () => {
  const data = getData();
  const cellBorders = "columns";

  return (
    <Gantt
      cellBorders={cellBorders}
      tasks={data.tasks}
      // other settings
    />
  );
};

export default GanttComponent;
```

### 🧠 작동 방식

- `cellBorders="full"` → Gantt grid의 모든 라인이 표시됩니다.  
- `cellBorders="columns"` → 수평선은 숨기고 세로선만 표시됩니다.

---

## 🔗 Related Articles

- [baselines](https://docs.svar.dev/react/gantt/api/properties/baselines)  
- [cellHeight](https://docs.svar.dev/react/gantt/api/properties/cellHeight)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  

모든 제품명과 회사명은 해당 소유자의 상표일 수 있습니다.

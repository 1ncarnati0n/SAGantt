# baselines

이 문서는 **React Gantt API**의 `baselines` 속성(Property)에 대한 설명입니다.  
전문 용어(예: Property, Gantt, task 등)는 영어 그대로 유지하고, 설명은 한국어로 번역하였습니다.

---

## 📝 Description

`baselines` 속성은 **task의 baseline(기준선)**을 Gantt 차트에서 표시하거나 숨기도록 설정합니다.  
기본적으로 baseline은 표시되지 않으며(`false`), 이를 활성화하려면 `true`로 지정해야 합니다.

---

## ⚙️ Usage

```ts
baselines?: boolean;
```

### Parameters

| 파라미터 | 설명 |
|:--|:--|
| **baselines** | baseline 표시 여부를 설정합니다. 기본값은 `false`입니다. |

> 💡 참고:  
> baseline을 표시하려면 `tasks` 속성 내 각 task에 대해 `base_start`와 `base_end` 값을 지정해야 합니다.

---

## 💡 Example

아래 예시는 `baselines`를 활성화하고 각 task에 baseline 기간을 정의한 코드입니다.

```jsx
import React, { useRef } from "react";
import { getData } from "../data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const MyGanttComponent = () => {
  const data = getData();
  const tasks = [
    {
      id: 1,
      start: new Date(2024, 3, 3),
      duration: 4,
      text: "React Gantt Widget",
      progress: 60,
      type: "summary",
      open: true,
      base_start: new Date(2024, 3, 3),
      base_end: new Date(2024, 3, 6),
    },
    {
      id: 2,
      start: new Date(2024, 3, 3),
      duration: 3,
      text: "Lib-Gantt",
      progress: 80,
      parent: 1,
      type: "task",
      base_start: new Date(2024, 3, 3),
      base_end: new Date(2024, 3, 6),
    },
  ];

  return (
    <Gantt
      baselines={true}
      cellHeight={45}
      tasks={tasks}
      links={data.links}
      scales={data.scales}
    />
  );
};

export default MyGanttComponent;
```

### 🧠 작동 방식

- `baselines={true}`로 설정하면 각 task의 기준선(`base_start`, `base_end`)이 Gantt 차트에 표시됩니다.  
- baseline은 실제 작업 일정과 비교하여 계획 대비 진행 상황을 시각적으로 확인할 때 유용합니다.

---

## 🔗 Related Articles

- [activeTask](https://docs.svar.dev/react/gantt/api/properties/activeTask)  
- [cellBorders](https://docs.svar.dev/react/gantt/api/properties/cellBorders)

---

© XB Software Sp. z o.o. 2024  
ul. DOMANIEWSKA, 17/19, lok. 133  
Warsaw, 02-672, Poland  

모든 제품명과 회사명은 해당 소유자의 상표일 수 있습니다.

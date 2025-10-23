
## zoom (확대/축소 설정)

### Description (설명)
`zoom` 속성은 **Gantt 차트(Gantt chart)**의 확대(zoom in) 및 축소(zoom out) 기능을 활성화하거나 구성합니다.

### Usage (사용법)
```ts
zoom?: boolean | {
  level: number,
  minCellWidth?: number,
  maxCellWidth?: number,
  levels?: [{
    minCellWidth: number,
    maxCellWidth: number,
    scales: [{
      unit: string,
      step: number,
      format: string,
    }]
  }];
};
```

### Parameters (매개변수)
- **zoom**: 확대 기능을 활성화하거나 비활성화합니다.  
  - `true`: 기본 확대 설정을 활성화 (기본값)  
  - `false`: 확대 기능 비활성화  
  - 객체(Object) 형태로 전달할 경우 다음과 같은 세부 설정이 가능합니다:

#### zoom 객체 속성
- **level** *(필수)*: 초기 확대 레벨 (기본적으로 0~5 범위).  
  확대 레벨 수는 `levels` 배열 내의 객체 수에 따라 달라집니다.
- **minCellWidth** *(선택)*: 최소 셀 너비(px). 설정되지 않으면 기본값 `50px`이 적용됩니다.
- **maxCellWidth** *(선택)*: 최대 셀 너비(px). 설정되지 않으면 기본값 `300px`이 적용됩니다.
- **levels** *(필수)*: 확대 레벨에 대한 배열. 각 객체는 다음 속성을 가집니다:
  - **minCellWidth** *(선택)*: 해당 레벨의 최소 셀 너비(px).
  - **maxCellWidth** *(선택)*: 해당 레벨의 최대 셀 너비(px).
  - **scales** *(필수)*: 시간 축(Scale) 데이터 배열.  
    각 스케일 객체는 다음 속성을 포함합니다:
    - **unit** *(필수)*: 스케일 단위 (`"hour"`, `"day"`, `"week"`, `"month"`, `"quarter"`, `"year"`)
    - **step** *(필수)*: 셀당 단위 수 (예: `1` = 1일, `6` = 6시간 등)
    - **format** *(필수)*: 날짜 포맷. [`date-fns`](https://date-fns.org/v2.29.3/docs/format) 형식 문자열 또는 함수 형태로 지정 가능.  
      함수일 경우 `(start, end)` 파라미터를 받아 포맷된 문자열을 반환해야 합니다.

### Example (예시)
```jsx
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const data = getData();

const zoomConfig = {
  maxCellWidth: 400,
  level: 3,
  levels: [
    {
      minCellWidth: 200,
      scales: [{ unit: "year", step: 1, format: "yyyy" }],
    },
    {
      minCellWidth: 150,
      scales: [
        { unit: "year", step: 1, format: "yyyy" },
        { unit: "quarter", step: 1, format: "QQQQ" },
      ],
    },
    {
      minCellWidth: 250,
      scales: [
        { unit: "quarter", step: 1, format: "QQQQ" },
        { unit: "month", step: 1, format: "MMMM yyy" },
      ],
    },
    {
      minCellWidth: 100,
      scales: [
        { unit: "month", step: 1, format: "MMMM yyy" },
        { unit: "week", step: 1, format: "'week' w" },
      ],
    },
    {
      maxCellWidth: 200,
      scales: [
        { unit: "month", step: 1, format: "MMMM yyy" },
        { unit: "day", step: 1, format: "d", css: dayStyle },
      ],
    },
    {
      minCellWidth: 25,
      scales: [
        { unit: "day", step: 1, format: "MMM d", css: dayStyle },
        { unit: "hour", step: 6, format: hoursTemplate },
      ],
    },
    {
      scales: [
        { unit: "day", step: 1, format: "MMM d", css: dayStyle },
        { unit: "hour", step: 1, format: "HH:mm" },
      ],
    },
  ],
};

function App() {
  return <Gantt zoom={zoomConfig} tasks={data.tasks} />;
}

export default App;
```

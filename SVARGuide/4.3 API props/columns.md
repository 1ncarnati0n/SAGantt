## columns | React Gantt Documentation

### 설명 (Description)
`columns` 속성은 **Gantt 차트의 컬럼(column) 설정을 정의하는 객체 배열(array of objects)**입니다.

### 사용법 (Usage)
```javascript
columns?: [
  {
    width?: number,
    align?: "left" | "right" | "center",
    flexgrow?: number,
    header: string,
    id: string,
    sort?: boolean,
    template?: {
      (b: any): string;
    };
  }
] | false;
```

### 매개변수 (Parameters)
- **flexgrow** *(optional)* — 그리드의 전체 너비 중에서 각 컬럼이 차지할 비율을 지정합니다.  
  (예: 한 컬럼에 `flexgrow: 1`만 설정되면 해당 컬럼이 전체 가용 너비를 차지합니다.)  
- **width** *(optional)* — 컬럼의 너비 값을 설정합니다. 기본값은 `"120px"`입니다.  
- **align** *(optional)* — 텍스트 정렬 방식(`text-align` 속성)을 설정합니다. 기본값은 `"left"`입니다.  
- **header** *(required)* — 컬럼 헤더에 표시될 텍스트입니다.  
- **id** *(required)* — 컬럼의 고유 식별자입니다.  
- **sort** *(optional)* — `true`(기본값)로 설정 시 정렬(sorting)을 활성화합니다. `false`로 설정 시 비활성화됩니다.  
- **template** *(optional)* — 각 셀에 표시될 내용을 사용자 정의할 때 사용합니다. 함수 형태로 객체를 받아 문자열을 반환합니다.  

> 참고: `columns` 속성을 `false`로 설정하면 **Task Tree 영역이 숨겨집니다.**

### 기본 구성 (Default Config)
```javascript
[
  { id: "text", header: "Task name", flexGrow: 1, sort: true },
  { id: "start", header: "Start date", align: "center", sort: true },
  { id: "duration", header: "Duration", width: 90, align: "center", sort: true },
  { id: "action", header: "", width: 50, align: "center" },
];
```

### 예제 (Example)
```javascript
import { getData } from "./common/data";
import { Gantt } from "../src/";

const data = getData();
const columns = [
  { id: "text", header: "Task name", flexgrow: 2 },
  {
    id: "start",
    header: "Start date",
    flexgrow: 1,
    align: "center",
  },
  {
    id: "duration",
    header: "Duration",
    align: "center",
    flexgrow: 1,
  },
  {
    id: "action",
    header: "",
    width: 50,
    align: "center",
  },
];

function App() {
  return (
    <Gantt tasks={data.tasks} links={data.links} scales={data.scales} columns={columns} />
  );
}

export default App;
```

#### Task Tree 비활성화 예시
```javascript
import { getData } from "./common/data";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const App = () => {
  const data = getData();

  return (
    <Gantt
      tasks={data.tasks}
      links={data.links}
      scales={data.scales}
      columns={false}
    />
  );
};

export default App;
```

### 관련 문서 (Related Articles)
- [cellWidth](https://docs.svar.dev/react/gantt/api/properties/cellWidth) (이전)
- [editorShape](https://docs.svar.dev/react/gantt/api/properties/editorShape) (다음)

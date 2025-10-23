
## editorShape (에디터 구조 설정)

### Description (설명)
`editorShape` 속성은 **Editor Dialog (에디터 대화상자)**의 모양과 기능을 관리하기 위한 설정 객체 배열입니다.

### Usage (사용법)
```ts
editorShape?: [
  // 공통 파라미터
  {
    key: string,
    label?: string,
  },
  // text 및 textarea 타입
  {
    key: string,
    label?: string,
    type: "text" | "textarea",
    config?: {
      placeholder: string,
      focus: boolean
    }
  },
  // combo, select, multiselect 컨트롤
  {
    key: string,
    label?: string,
    type: "combo" | "select" | "multiselect",
    options?: {
      id: any,
      label?: string
    }[],
    config?: {}
  },
  // slider 타입
  {
    key: string,
    label?: string,
    type: "slider",
    config?: {
      width: number,
      min: number,
      max: number,
      disabled: boolean,
      step: number
    }
  },
  // date 타입
  {
    key: string,
    label?: string,
    type: "date",
    time?: boolean,
    config?: {}
  },
  // counter 타입
  {
    key: string,
    label?: string,
    type: "counter",
    config?: {
      min: number,
      max: number,
    }
  },
  // link 타입
  {
    key: string,
    label?: string,
    type: "links"
  }
]
```

### Parameters (매개변수)
`editorShape`를 통해 에디터의 모양 및 동작을 구성할 수 있습니다.

#### Common Parameters (공통 파라미터)
- **key** *(필수)*: 작업(Task) 객체의 데이터 필드 이름. 고유해야 함.
- **label** *(선택)*: 필드의 표시 이름
- **type** *(필수)*: 에디터 필드 유형 — `select`, `text`, `textarea`, `counter`, `date`, `slider`, `link`
- **config** *(선택)*: 각 컨트롤에 대한 설정 객체. 예: `placeholder`, `focus`, `disabled` 등

#### Parameters for "text" and "textarea" types (텍스트, 텍스트영역)
- **type**: `"text"` 또는 `"textarea"`
- **key**: 데이터 필드 이름
- **label**: 필드 표시 이름
- **config**: `{ placeholder?: string, focus?: boolean, disabled?: boolean }`

```jsx
const editorShape = [
  {
    key: "Text",
    type: "text",
    label: "Name",
    config: {
      placeholder: "Task name",
      focus: true,
    },
  },
];
```

#### Parameters for "combo", "select", "multiselect" (콤보, 선택, 다중선택)
- **type**: `"combo" | "select" | "multiselect"`
- **key**: 필드 이름
- **options**: 선택 항목 배열 `{ id, label }`
- **config**: WX 컨트롤 설정 객체

```jsx
const editorShape = [
  {
    key: "Combo",
    type: "select",
    label: "Type",
  },
];
```

#### Parameters for "slider" type (슬라이더)
- **type**: `"slider"`
- **config**: `{ width, min, max, disabled }`

```jsx
const editorShape = [
  {
    key: "Slider",
    type: "slider",
    label: "Progress",
  },
];
```

#### Parameters for "date" type (날짜 선택기)
- **type**: `"date"`
- **time**: *(선택)* `true`일 경우 시간 표시

```jsx
const editorShape = [
  { key: "DatePicker", type: "date", label: "Start date" },
  { key: "DatePicker", type: "date", label: "End date" },
];
```

#### Parameters for "counter" type (카운터)
- **type**: `"counter"`
- **config**: `{ min, max }`

```jsx
const editorShape = [
  {
    key: "Counter",
    type: "counter",
    label: "Duration",
    config: { min: 1, max: 100 },
  },
];
```

#### Parameters for "link" type (링크)
- **type**: `"link"`
- **key**: 링크 필드 이름

### Default Config (기본 구성 예시)
```jsx
<form>
  <div><label htmlFor="text">Name</label><input type="text" id="text" placeholder="Add task name" autoFocus /></div>
  <div><label htmlFor="details">Description</label><textarea id="details" placeholder="Add description"></textarea></div>
  <div><label htmlFor="type">Type</label><select id="type"></select></div>
  <div><label htmlFor="start">Start date</label><input type="date" id="start" /></div>
  <div><label htmlFor="end">End date</label><input type="date" id="end" /></div>
  <div><label htmlFor="duration">Duration</label><input type="number" id="duration" min="1" max="100" /></div>
  <div><label htmlFor="progress">Progress</label><input type="range" id="progress" /></div>
  <div><label htmlFor="links">Links</label><input type="url" id="links" /></div>
</form>
```

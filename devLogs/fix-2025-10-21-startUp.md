# DEVLOG

**Last Updated**: 2025-10-21

---

## 프로젝트 개요
- **프로젝트명**: `ConTech Gantt: `
- **목표**: `wx-react-gantt` 컴포넌트를 활용해 공정표(Gantt Chart) UI를 구축하고, 실제 운영 데이터 연계 이전까지는 `mock.json` 기반의 데모 데이터를 가시화/편집 툴로 사용
- **기술 스택**
  - React 18, Vite 5 (TypeScript)
  - 스타일: CSS 모듈 (`globals.css`, `ganttTheme.css`)
  - Gantt 라이브러리: `wx-react-gantt`


## 1. DemoTask 인터페이스 수정

**파일**: `src/data/demoSchedule.ts` (Line 19)

```typescript
open?: boolean;  // Task Tree 펼침 상태
```

---

## 2. MockTask 인터페이스 수정

**파일**: `src/data/demoSchedule.ts` (Line 54)

```typescript
open?: boolean;  // Task Tree 펼침 상태
```

---

## 3. Mock 데이터에 open 속성 적용

**파일**: `src/data/mock.json`

모든 Summary Task에 `"open": true` 추가:

| ID | Task 이름 | 위치 |
|----|---------|------|
| 1 | 골조공정(C.P) | Line 13 |
| 100 | 지하골조(벽체+슬라브) | Line 35 |
| 200 | 지하골조(벽체1단) | Line 148 |
| 300 | 지상골조(세팅층) | Line 222 |
| 400 | 지상골조 (일반,마감 층) | Line 322 |


## 폴더/파일 구조 하이라이트
- `src/App.tsx`: 최상위 컴포넌트. Gantt preview 섹션만 렌더링.
- `src/components/GanttPreview.tsx`: 뷰 타입(일/주/월) 전환, 기준 일정 표시 토글, `wx-react-gantt` 설정을 담당하는 핵심 UI.
- `src/data/mock.json`: 데모 데이터 원본. 테스크/링크/스케일을 JSON으로 정의.
- `src/data/demoSchedule.ts`: `mock.json`을 읽어 타입 변환(`Date`) 및 가공(색상 결정, 마일스톤 duration 처리) 후 React 컴포넌트에서 사용 가능하도록 제공.
- `src/styles/`: 전체 스타일(`globals.css`)과 Gantt 테마(`ganttTheme.css`).
- `GuideSVAR/`: `wx-react-gantt` 사용법 참고 문서. 이벤트, API, 커스터마이징 예제가 포함됨.
- `devLogs/`: 과거 작업 로그. `log001_taskTree.md`에서 Summary Task 펼침 설정 정리.

## 현재 데이터 흐름
1. `GanttPreview`가 렌더링될 때 `getDemoSchedule()`을 호출해 `mock.json`을 `DemoSchedule`로 변환.
2. 각 Task는 `workType`에 따라 색상 지정, `type === 'milestone'`일 경우 duration 조정.
3. 변환된 데이터는 `Gantt` 컴포넌트에 `tasks`, `links`, `scales` props로 전달.
4. `viewType`(일/주/월) 전환 시 셀 너비와 스케일 구성이 유연하게 변경.
5. 개발 모드에서 UI 편집이 발생하면 이벤트를 수신해 최신 스냅샷을 생성하고, dev 서버 미들웨어로 `mock.json`을 동기화.

## 진행 상황
- 기본 Gantt 렌더링과 뷰 토글, 기준 일정 표시/숨김 기능은 정상 동작.
- `mock.json`의 summary task에 `open` 속성이 추가되어 로딩 시 모두 펼쳐진 상태로 노출.
- 개발 모드에서 Gantt UI 편집 이벤트가 발생하면 dev 서버 미들웨어를 통해 `mock.json`이 즉시 갱신되도록 연동.

## 향후 작업 계획
1. **동기화 안정화**
   - API 응답 에러 처리와 사용자 피드백 향상.
   - drag 연속 이벤트에 대한 추가 디바운스/배치 처리 검토.
2. **입력/검증 UX 개선**
   - 신규 Task 추가 시 기본값, validation 메시지 제공.
   - Summary/Milestone 등 특수 타입 처리 로직 정교화.
3. **자동화 테스트**
   - Vitest + React Testing Library로 뷰 전환, 데이터 파싱 유닛 테스트 구성.
4. **문서화**
   - DEVLOG 지속 업데이트, 주요 API 사용 패턴 정리.

## 로컬 개발 메모
- 개발 서버: `npm install`, `npm run dev`
- 서버 미들웨어는 개발 모드(`vite dev`)에서만 동작하며, 저장 시 `src/data/mock.json`을 overwrite.
- JSON 포맷 유지 및 정렬을 위해 저장 시 `JSON.stringify(data, null, 4)` 사용.

---

> 다음 업데이트에서는 Gantt UI에서의 조작이 곧바로 `mock.json` 파일로 반영되도록 하는 2-way 데이터 플로우 안정화와 관련 테스트 케이스 추가 예정.

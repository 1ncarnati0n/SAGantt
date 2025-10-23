# Gantt Mock 데이터 동기화 이슈 정리 (2025-10-23)

## 문제 현상
- Gantt UI에서 작업(Task)이나 링크(Link)를 수정/추가/삭제한 뒤 **저장** 버튼을 눌러도 `public/mock.json` 파일 내용이 갱신되지 않음.
- Dev 서버 로그에는 `POST /api/mock`이 정상적으로 성공했다고 표시되지만, 실제 파일을 열어보면 변경 이전의 데이터가 유지됨.
- 페이지를 새로고침하면 항상 초기(mock) 데이터만 로드됨.

## 원인 분석
1. **이벤트 페이로드 구조 차이**
    - `wx-react-gantt`가 내보내는 이벤트(`onUpdateTask`, `onAddTask`, `onAddLink` 등)는 상황에 따라 다양한 형태의 페이로드를 전달함.
    - 예) `update-task` 이벤트 경우 `{ id, task }` 형태이며, `task` 객체 내부에 실제 변경 내용이 포함됨.
    - 기존 로직은 이벤트 객체를 그대로 `currentTasksRef`/`currentLinksRef`에 저장하려다 보니, 저장 직전에 직렬화된 데이터가 제대로 누적되지 않았음.

2. **ID 타입 불일치**
    - Gantt 내부에서 문자열 ID를 사용하는데, 기존 로직은 숫자 ID와 문자열 ID를 엄격 비교(`===`)함 → 동일한 작업을 찾지 못하고 새 항목으로 취급하거나 업데이트 누락.

3. **API 스냅샷 누락**
    - 드래그 등 몇몇 이벤트는 충분한 세부 정보를 담지 않은 페이로드를 전달함.
    - `apiRef.current.getTask(id)`를 호출해 최신 스냅샷을 가져오지 않으면 저장 직전에 데이터가 오래된 상태로 남아 있었음.

## 적용한 해결책
1. **페이로드 정규화 헬퍼 추가**
    - `toPlainTask`, `toPlainLink` 헬퍼를 만들어 이벤트 페이로드에서 `task`/`link` 객체를 추출하고 ID가 빠진 경우 상위 `id`를 보강.
    - `updateTaskInRef`, `handleTaskAdd`, `handleLinkAdd` 등 모든 핸들러에서 이 헬퍼를 사용해 참조(ref) 상태를 일관되게 유지.

2. **ID 비교 함수 도입**
    - `idsAreEqual` 헬퍼로 ID를 문자열로 비교하도록 변경해 숫자/문자열 혼용 시에도 동일 항목을 인식.

3. **Gantt API 접근 추가**
    - 이벤트에 완전한 데이터가 없으면 `apiRef.current.getTask(id)`를 호출해 최신 정보를 가져온 뒤 ref에 반영하도록 수정.

4. **경고/로그 개선**
    - ID가 없는 페이로드가 들어오는 경우 `console.warn`으로 즉시 감지할 수 있도록 해서 향후 디버깅을 용이하게 함.

## 수정 파일
- `SAGantt/src/components/GanttPreview.tsx`
    - 페이로드 정규화 및 ID 처리 헬퍼 추가
    - 각 이벤트 핸들러에서 정규화된 데이터를 사용하도록 개선
    - Gantt API 호출로 최신 스냅샷 확보

- `SAGantt/vite.config.ts`
    - dev 서버 미들웨어 저장 경로를 `data/schedule.json` → `public/mock.json`으로 정정 (초기 동작 보완)

## 검증 방법
1. `npm run dev` 실행.
2. Gantt UI에서 작업/링크를 수정하거나 새로 추가 후 **저장** 버튼 클릭.
3. 콘솔 로그에서 `✅ [API] File written successfully` 확인.
4. `public/mock.json`을 열어 최신 변경 사항 반영 여부 확인.
5. 페이지 새로고침 후 방금 저장한 내용이 그대로 표시되는지 검증.

## 향후 고려 사항
- 대량 편집 시 이벤트가 빈번히 발생하므로 디바운스나 배치 저장 고려.
- 자동화 테스트를 추가해 주요 편집 시나리오가 `mock.json`에 반영되는지 정기적으로 검증.

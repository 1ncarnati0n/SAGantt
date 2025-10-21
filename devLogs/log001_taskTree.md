# Task Tree 펼침 설정

**날짜**: 2025-10-21

---

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

---

## 결과

페이지 로딩 시 모든 Summary Task가 **기본적으로 펼쳐진 상태**로 표시됨


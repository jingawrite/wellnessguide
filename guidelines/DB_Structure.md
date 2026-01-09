# 콘텐츠 마케팅 캠프 어드민 - DB 구조 설계

## 전제 조건

**캠프 유형은 Brown이 입력한 내용대로 분류**
- 유형을 코드로 고정하기보다, Brown이 입력하는 문자열/태그를 기준으로 분류하는 구조
- `Camps.type`은 자유 텍스트 필드로 설계
- 통계/필터는 이 값을 그대로 사용

---

## 1. 캠프 마스터: `Camps`

한 캠프(예: "24-1 콘텐츠마케팅 직무부트캠프 인덕대") 단위.

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `name` | VARCHAR(255) | 캠프 이름 | NOT NULL |
| `type` | VARCHAR(100) | 캠프 유형 (자유 텍스트) | NOT NULL |
| `client_name` | VARCHAR(255) | 파트너/학교/기업명 | NULL 허용 |
| `status` | VARCHAR(50) | 상태 | NOT NULL, ENUM('준비중', '진행중', '종료') |
| `start_date` | DATE | 시작일 | NULL 허용 |
| `end_date` | DATE | 종료일 | NULL 허용 |
| `week_count` | INT | 전체 주차 수 | NULL 허용 |
| `note` | TEXT | 비고 (운영 특이사항 메모) | NULL 허용 |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 캠프 유형 예시
- Co-Work
- 재맞고
- 서류패스
- 진로부트캠프
- 자율일정
- 직무특강
- 직무부트캠프

### 인덱스
- `idx_type`: `type` 필드 (검색/필터 최적화)
- `idx_status`: `status` 필드
- `idx_dates`: `start_date`, `end_date` (기간 검색)

### 참고사항
- 추후에 "캠프유형 마스터"를 별도 테이블로 뽑고 싶으면 `CampTypes`로 분리 가능
- 현재는 Brown이 텍스트로 입력한 값 자체가 분류 기준이 되도록 설계

---

## 2. 세션/주차: `CampSessions`

캠프 안의 "회차/주차" 단위 (1주차, 2주차 오프라인 세션 등).

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `camp_id` | INT/BIGINT | 캠프 ID | FK → `Camps.id`, NOT NULL |
| `week_no` | INT | 주차 번호 (1,2,3…) | NOT NULL |
| `title` | VARCHAR(255) | 세션명 | NOT NULL |
| `session_date` | DATETIME | 실제 진행일시 | NULL 허용 |
| `mode` | VARCHAR(50) | 방식 | NOT NULL, ENUM('온라인', '오프라인', '하이브리드') |
| `location` | VARCHAR(500) | 장소(혹은 ZOOM 링크, ZEP 링크) | NULL 허용 |
| `assignment_id` | INT/BIGINT | 해당 주차 대표 과제 연결 | FK → `Assignments.id`, NULL 허용 |
| `note` | TEXT | 운영 메모 (지각/결석 많았던 날, 기술 이슈 등) | NULL 허용 |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 인덱스
- `idx_camp_week`: `camp_id`, `week_no` (복합 인덱스)
- `idx_session_date`: `session_date` (일정 조회 최적화)

---

## 3. 멘티: `Mentees`

캠프 전체 혹은 여러 캠프에 참여하는 멘티 정보.

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `name` | VARCHAR(100) | 이름 | NOT NULL |
| `email` | VARCHAR(255) | 이메일 | UNIQUE, NULL 허용 |
| `phone` | VARCHAR(50) | 전화번호 | NULL 허용 |
| `school_or_company` | VARCHAR(255) | 학교/회사 | NULL 허용 |
| `major_or_team` | VARCHAR(255) | 전공/팀 | NULL 허용 |
| `enter_path` | VARCHAR(100) | 유입경로 | NULL 허용 |
| `note` | TEXT | 멘티 특이사항, 향후 추천 가능성 등 | NULL 허용 |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 유입경로 예시
- 학교 홍보
- 코멘토
- 지인추천
- 기타

### 인덱스
- `idx_email`: `email` (로그인/중복 체크)
- `idx_name`: `name` (검색 최적화)

---

## 4. 캠프-멘티 매핑: `CampMentees`

어떤 캠프에 어떤 멘티가 참여했는지.

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `camp_id` | INT/BIGINT | 캠프 ID | FK → `Camps.id`, NOT NULL |
| `mentee_id` | INT/BIGINT | 멘티 ID | FK → `Mentees.id`, NOT NULL |
| `role` | VARCHAR(50) | 역할 | NULL 허용, ENUM('멘티', '팀장', '조장') |
| `attendance_score` | INT | 출석 총점 | NULL 허용, DEFAULT 0 |
| `final_result` | VARCHAR(50) | 최종 결과 | NULL 허용, ENUM('수료', '미수료', '우수 수료') |
| `note` | TEXT | 메모 | NULL 허용 |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 제약조건
- UNIQUE(`camp_id`, `mentee_id`): 한 멘티는 한 캠프에 한 번만 참여 가능

### 인덱스
- `idx_camp_mentee`: `camp_id`, `mentee_id` (복합 인덱스)
- `idx_mentee`: `mentee_id` (멘티별 캠프 조회)

---

## 5. 과제 마스터: `Assignments`

주차별 과제 정의. (템플릿으로 이미 갖고 있는 "1주차 과제: 브랜드 분석" 같은 것)

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `camp_type` | VARCHAR(100) | 캠프 유형 텍스트 | NOT NULL |
| `week_no` | INT | 주차 | NOT NULL |
| `title` | VARCHAR(255) | 과제명 | NOT NULL |
| `description` | TEXT | 과제 설명 전문 (PPT/PDF로 안내하는 그 텍스트) | NULL 허용 |
| `rubric` | JSON/TEXT | 평가 기준 | NULL 허용 |
| `feedback_template_id` | INT/BIGINT | 피드백 템플릿 ID | FK → `FeedbackTemplates.id`, NULL 허용 |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 참고사항
- 같은 "1주차"라도 캠프 유형에 따라 과제 정의가 다를 수 있음
- `camp_type`은 `Camps.type`과 동일한 자유 텍스트 값 사용

### 인덱스
- `idx_camp_type_week`: `camp_type`, `week_no` (복합 인덱스)

---

## 6. 멘티 과제 제출 DB: `Submissions`

지금 운영 중인 "업무 제출 DB"의 개념.

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `camp_id` | INT/BIGINT | 캠프 ID | FK → `Camps.id`, NOT NULL |
| `mentee_id` | INT/BIGINT | 멘티 ID | FK → `Mentees.id`, NOT NULL |
| `assignment_id` | INT/BIGINT | 과제 ID | FK → `Assignments.id`, NOT NULL |
| `week_no` | INT | 주차 | NOT NULL |
| `submitted_at` | DATETIME | 제출일시 | NULL 허용 |
| `file_url` | VARCHAR(1000) | 과제 파일 링크(Notion, 드라이브, PDF 등) | NULL 허용 |
| `status` | VARCHAR(50) | 제출 상태 | NOT NULL, ENUM('미제출', '제출', '재제출'), DEFAULT '미제출' |
| `auto_summary` | TEXT | NotebookLM/AI 요약 텍스트 | NULL 허용 |
| `score` | INT | 점수(있다면) | NULL 허용 |
| `tag` | VARCHAR(255) | 태그 (예: 페르소나 우수, 분석 강점, 협업아이디어 좋음…) | NULL 허용 |
| `note` | TEXT | 운영자 메모 | NULL 허용 |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 제약조건
- UNIQUE(`camp_id`, `mentee_id`, `assignment_id`): 한 멘티는 한 과제에 한 번만 제출 가능 (재제출은 status로 관리)

### 인덱스
- `idx_camp_mentee_assignment`: `camp_id`, `mentee_id`, `assignment_id` (복합 인덱스)
- `idx_status`: `status` (제출 상태 필터)
- `idx_submitted_at`: `submitted_at` (제출일시 정렬)

---

## 7. 피드백: `Feedbacks`

각 제출 건에 대한 Brown의 피드백 저장 (지금 프롬프트 기반으로 AI가 작성하는 부분과 연결).

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `submission_id` | INT/BIGINT | 제출 ID | FK → `Submissions.id`, NOT NULL |
| `camp_id` | INT/BIGINT | 캠프 ID | FK → `Camps.id`, NOT NULL |
| `mentee_id` | INT/BIGINT | 멘티 ID | FK → `Mentees.id`, NOT NULL |
| `week_no` | INT | 주차 | NOT NULL |
| `feedback_text` | TEXT | 실제 피드백 전문 | NOT NULL |
| `feedback_source` | VARCHAR(50) | 작성 방식 | NOT NULL, ENUM('직접 작성', 'AI초안+수정', '전체 자동생성') |
| `is_sent` | BOOLEAN | 멘티에게 발송 완료 여부 | DEFAULT FALSE |
| `sent_channel` | VARCHAR(50) | 발송 채널 | NULL 허용, ENUM('코멘토', '카카오 단체방', '이메일') |
| `sent_at` | DATETIME | 발송일시 | NULL 허용 |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 제약조건
- UNIQUE(`submission_id`): 한 제출 건당 피드백은 하나만 존재

### 인덱스
- `idx_submission`: `submission_id` (제출 건별 피드백 조회)
- `idx_camp_mentee_week`: `camp_id`, `mentee_id`, `week_no` (멘티별 주차별 피드백 조회)
- `idx_is_sent`: `is_sent` (발송 상태 필터)

---

## 8. 피드백 템플릿: `FeedbackTemplates` (옵션)

피드백 작성 시 사용할 템플릿 관리.

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `camp_type` | VARCHAR(100) | 캠프 유형 | NOT NULL |
| `week_no` | INT | 주차 | NULL 허용 (NULL이면 전체 주차 공통) |
| `template_name` | VARCHAR(255) | 템플릿명 | NOT NULL |
| `prompt_template` | TEXT | 프롬프트 템플릿 | NOT NULL |
| `is_active` | BOOLEAN | 사용 여부 | DEFAULT TRUE |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

---

## 9. 캠프 유형 마스터: `CampTypes` (옵션)

나중에 "내가 입력한 유형들"을 정리해서 관리하고 싶을 때.

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `name` | VARCHAR(100) | 유형명 | UNIQUE, NOT NULL |
| `description` | TEXT | 설명 | NULL 허용 |
| `default_weeks` | INT | 기본 주차 수 | NULL 허용 |
| `default_assignments` | JSON | 기본 과제 세트 | NULL 허용 |
| `is_active` | BOOLEAN | 사용 여부 | DEFAULT TRUE |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 수정일시 | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 참고사항
- 초기에는 `Camps.type`을 **그냥 자유 텍스트**로 두고, 일정 기준 이상 쌓이면 `CampTypes`로 승격시키는 쪽 추천
- `CampTypes`와 `Camps.type`을 매핑하는 별도 테이블(`CampTypeMappings`)을 만들어 오타/변형을 통합 관리할 수 있음

---

## 10. 공지/멘트 로그: `Announcements` (옵션)

단체방에 보낸 공지/멘트 히스토리 관리.

### 필드 정의

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | INT/BIGINT | 기본키 | PK, AUTO_INCREMENT |
| `camp_id` | INT/BIGINT | 캠프 ID | FK → `Camps.id`, NOT NULL |
| `session_id` | INT/BIGINT | 세션 ID | FK → `CampSessions.id`, NULL 허용 |
| `announcement_type` | VARCHAR(50) | 유형 | NOT NULL, ENUM('D-1', '과제 리마인드', '수료 안내', '기타') |
| `content` | TEXT | 내용 | NOT NULL |
| `sent_channel` | VARCHAR(50) | 발송 채널 | NOT NULL, ENUM('코멘토', '카카오 단체방', '이메일') |
| `sent_at` | DATETIME | 발송일시 | NOT NULL |
| `created_at` | TIMESTAMP | 생성일시 | DEFAULT CURRENT_TIMESTAMP |

### 인덱스
- `idx_camp_sent`: `camp_id`, `sent_at` (캠프별 발송 로그 조회)

---

## ERD 관계도 요약

```
Camps (1) ──< (N) CampSessions
Camps (1) ──< (N) CampMentees
Mentees (1) ──< (N) CampMentees
Camps (1) ──< (N) Submissions
Mentees (1) ──< (N) Submissions
Assignments (1) ──< (N) Submissions
CampSessions (1) ──< (1) Assignments (optional)
Submissions (1) ──< (1) Feedbacks
Assignments (N) ──> (1) FeedbackTemplates (optional)
Camps (N) ──> (1) CampTypes (optional, via type mapping)
```

---

## 구현 우선순위

### Phase 1 (필수)
1. `Camps` - 캠프 마스터
2. `CampSessions` - 세션/주차
3. `Mentees` - 멘티
4. `CampMentees` - 캠프-멘티 매핑
5. `Assignments` - 과제 마스터
6. `Submissions` - 멘티 과제 제출
7. `Feedbacks` - 피드백

### Phase 2 (옵션)
8. `FeedbackTemplates` - 피드백 템플릿
9. `Announcements` - 공지/멘트 로그
10. `CampTypes` - 캠프 유형 마스터 (나중에 정리용)


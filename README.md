# ForYou

Spring Boot와 React로 구성된 웹 애플리케이션입니다.

## 기술 스택

- Backend: Java 17, Spring Boot, Spring Web, Spring Data JPA, Gradle
- Frontend: Node.js 22, React, Vite, Oxlint
- Database: PostgreSQL 15, Flyway (테스트: H2)

## 프로젝트 구조

```text
.
├── backend/    # Spring Boot API 서버
├── frontend/   # React 클라이언트
└── .github/    # GitHub 협업 설정 및 PR 템플릿
```

## 사전 준비

- JDK 17 이상
- Docker Desktop
- [nvm](https://github.com/nvm-sh/nvm) 또는 Node.js `22.12.0` 이상, `23.0.0` 미만

Gradle과 프론트엔드 패키지 버전은 각각 Gradle Wrapper와
`package-lock.json`으로 관리합니다.

## 로컬 실행

### 1. Backend

```bash
cd backend
docker compose -f docker-compose.local.yml up -d
./gradlew bootRun --args='--spring.profiles.active=local'
```

- 기본 주소: `http://localhost:8080`
- 로컬 DB 설정: [로컬 데이터베이스 개발 가이드](docs/local-database-guide.md)
- 테스트: `./gradlew test`
- 전체 빌드: `./gradlew build`

Windows에서는 `./gradlew` 대신 `gradlew.bat`을 사용합니다.

### 2. Frontend

저장소 루트에서 Node.js 버전을 맞춘 뒤 실행합니다.

```bash
nvm install
nvm use
cd frontend
npm ci
npm run dev
```

- 개발 서버: `http://localhost:5173`
- 린트: `npm run lint`
- 프로덕션 빌드: `npm run build`

개발 서버에서 `/api`로 시작하는 요청은
`http://localhost:8080`의 백엔드로 프록시됩니다. 프론트엔드에서는 로컬
백엔드 주소를 직접 작성하지 말고 `/api/...` 형태로 요청합니다.

## 환경변수

현재 로컬 실행에 필수인 환경변수는 없습니다.

- 프론트엔드 환경변수는 `VITE_` 접두사를 사용합니다.
- 개인 로컬 설정은 `frontend/.env.local`에 작성합니다.
- 비밀번호, API 키와 같은 비밀값은 Git에 커밋하지 않습니다.
- 백엔드 설정은 Spring Boot의 환경변수 매핑 또는 프로필별
  `application-{profile}.yaml`을 사용합니다.

새 환경변수를 추가하면 이름, 용도, 필수 여부와 예시값을 이 문서에 함께
기록합니다.

## 데이터베이스

로컬 개발은 Docker Compose로 PostgreSQL 15를 실행하고 Flyway로 스키마를
관리합니다. 자동화 테스트는 테스트 전용 H2를 사용합니다.

## 브랜치 규칙

- `main`: 배포 가능한 상태를 유지하는 기본 브랜치
- `feat/<작업명>`: 기능 개발
- `fix/<작업명>`: 버그 수정
- `refactor/<작업명>`: 동작 변경 없는 구조 개선
- `docs/<작업명>`: 문서 변경
- `chore/<작업명>`: 설정 및 기타 작업

브랜치 이름의 작업명은 소문자와 하이픈을 사용합니다. 예:
`feat/user-profile`

## 커밋 규칙

커밋 메시지는 다음 형식을 사용합니다.

```text
<type>: WBS<작업번호 4자리> <작업 항목> <진행 상태>
```

사용 가능한 `type`은 `feat`, `fix`, `refactor`, `test`, `docs`, `chore`입니다.

```text
feat: 사용자 프로필 조회 API 추가
fix: 로그인 실패 시 오류 메시지 수정
docs: 로컬 실행 방법 추가
```

한 커밋에는 하나의 논리적인 변경만 포함하고, PR을 만들기 전에 관련 테스트와
린트 및 빌드를 실행합니다.

## Pull Request 확인 사항

- 변경 목적과 구현 내용을 설명했는가
- API, 화면 또는 DB 변경 사항을 기록했는가
- 관련 테스트를 실행했는가
- 비밀값과 로컬 전용 파일이 포함되지 않았는가

PR 작성 시 [`.github/pull_request_template.md`](.github/pull_request_template.md)를
참고합니다.

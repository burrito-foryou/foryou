# 배포 파이프라인

## 배포 방식 선택

- JAR 직접 배포와 Docker Compose를 비교해, 환경 일관성과 서비스 간 의존성(DB, Redis 등)
  관리가 쉬운 Docker Compose를 선택했습니다.
- Oracle Cloud 인스턴스 위에서 Docker Compose로 컨테이너 5개(nginx · frontend · backend ·
  postgres · redis)를 운영합니다.

## 이미지 빌드

- 백엔드/프론트엔드 모두 멀티스테이지 Docker 빌드를 사용합니다.
  - 백엔드: Gradle + JDK 이미지에서 JAR 빌드 → 경량 JRE 이미지에 JAR만 복사해 실행
  - 프론트엔드: Node.js 이미지에서 `npm run build` → Nginx 이미지에 `dist/`만 복사해 서빙
- 백엔드 이미지 빌드 시 테스트는 스킵합니다(`-x test`). 빌드 환경에는 DB 연결이 없어
  테스트가 실패하기 때문이며, 테스트 자체는 CI 단계에서 이미 검증합니다.

## nginx 설정

- React SPA 라우팅: 새로고침 시 404가 나지 않도록 `try_files`로 `index.html` 폴백을
  구성했습니다.
- `/api` 프록시: 백엔드 컨테이너로 요청을 전달합니다(Docker 내부 DNS로 서비스명 `backend`
  사용).
- nginx가 SSL 종단과 80/443 포트를 담당하고, frontend/backend 컨테이너는 외부 포트를
  노출하지 않습니다.

## CI/CD

- **CI** (`.github/workflows/ci.yml`): `dev`, `main`으로의 PR에서 트리거됩니다. 백엔드는
  PostgreSQL 서비스 컨테이너를 띄우고 `./gradlew build`(테스트 포함)를 실행하고,
  프론트엔드는 `npm run lint` → `npm run build`를 실행합니다.
- **CD** (`.github/workflows/deploy-dev.yml`): `dev` 브랜치에 push되면 트리거됩니다.
  백엔드/프론트엔드 이미지를 빌드해 GHCR에 `:dev` 태그로 push한 뒤, SSH로 개발 서버에
  접속해 이미지를 pull하고 컨테이너를 재시작합니다.

## 환경변수/시크릿 관리

- 비밀값이 포함된 설정 파일(`application-dev.yaml`, `application-jwt.yaml`,
  `application-oauth2.yaml`, `application-image.yaml` 등)은 저장소에 커밋하지 않고
  GitHub Secrets로 관리하다가, CI/배포 시점에 파일로 생성해 주입합니다.
- 프론트엔드 `.env`도 `FRONTEND_ENV` GitHub Secret에서 생성됩니다.
- 서버의 `.env`(DB 계정 정보)는 GitHub Actions가 아니라 서버에서 수동으로 생성·관리합니다.

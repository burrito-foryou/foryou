# 브랜치 전략

## 1. 브랜치 구조

`main - dev - feat/*` 구조로 브랜치를 관리한다.

| 브랜치 | 역할 | 배포 환경 |
|---|---|---|
| `main` | 최종 배포용 브랜치 | 운영 서버 |
| `dev` | 개발 통합 브랜치 | 개발 서버 |
| `feat/*` | 기능 개발 브랜치 | 로컬 작업 |

## 2. 배포 환경

**main 브랜치**

- 실제 운영 서버에 배포되는 브랜치 (`foryou.abcganada.xyz`)
- 운영 서버에 배포되는 브랜치이므로 직접 push하지 않고, 반드시 PR을 통해 merge한다.

**dev 브랜치**

- 개발 중인 기능들을 통합하는 브랜치 (`foryou-dev.abcganada.xyz`)
- 기능 브랜치에서 작업한 내용은 먼저 dev 브랜치로 PR을 보낸다.
- dev에 merge된 내용은 개발 서버에 배포하여 팀원들이 함께 테스트한다.

**feat 브랜치**

- 각 기능을 개발하는 브랜치. 예: `feat/auth`, `feat/question`, `feat/answer`,
  `feat/comment`, `feat/like`, `feat/search-filter`, `feat/image-upload`,
  `feat/notification`, `feat/mypage`
- 각자 맡은 기능은 dev 브랜치에서 새로운 feat/* 브랜치를 생성해 작업한다.

## 3. 작업 흐름

```
dev 브랜치 최신화
→ feat/* 브랜치 생성
→ 기능 개발
→ 로컬 테스트
→ dev 브랜치로 Pull Request 생성
→ 코드 리뷰
→ dev 브랜치에 merge
→ 개발 서버 배포 및 테스트
→ 기능 안정화 후 main 브랜치로 merge
→ 운영 서버 배포
```

## 4. 기능 개발 브랜치 생성 규칙

기능 개발은 반드시 dev 브랜치에서 분기한다.

```bash
git fetch
git checkout dev
git pull origin dev
git checkout -b feat/question
```

작업 완료 후에는 원격 저장소에 push한다.

```bash
git push origin feat/question
```

그 후 GitHub에서 `feat/question → dev` 방향으로 Pull Request를 생성한다.

## 5. 브랜치 Prefix

브랜치 prefix는 다음과 같이 사용한다.

| prefix | 용도 |
|---|---|
| `feat/` | 새로운 기능 개발 |
| `fix/` | 버그 수정 |
| `refactor/` | 기능 변화 없는 코드 개선 |
| `docs/` | 문서 수정 |
| `chore/` | 설정, 빌드, 의존성 등 기타 작업 |
| `deploy/` | 배포 관련 작업 |
| `style/` | 코드 포맷/스타일 수정 |

## 6. Pull Request 규칙

기능 개발이 끝나면 dev 브랜치로 Pull Request를 생성한다.

**PR 방향**

- `feat/* → dev`
- 운영 배포 시: `dev → main`

**PR 작성 내용**

```markdown
## 작업 내용
- 구현한 기능 요약

## 변경 사항
- 추가/수정된 API
- 추가/수정된 화면
- 변경된 DB 구조

## 테스트 내용
- 로컬 테스트 여부
- Postman 테스트 여부
- 화면 동작 확인 여부

## 참고 사항
- 리뷰어가 확인해야 할 내용
```

## 7. 코드 리뷰 규칙

dev 브랜치에 merge하기 전에는 코드 리뷰를 진행한다.

**리뷰 기준**

- 기능이 정상 동작하는지
- API 명세와 맞는지
- 불필요한 코드가 없는지
- 예외 처리가 되어 있는지
- 브랜치 범위와 관계없는 코드가 포함되지 않았는지
- 충돌 가능성이 있는지

**merge 기준**

- CI 검사(GitHub Actions 빌드/테스트) 통과
- 충돌이 있으면 작성자가 해결 후 다시 요청
- 기능 단위가 너무 크면 나눠서 PR

## 8. main 브랜치 운영 규칙

main 브랜치는 운영 서버에 배포되는 브랜치이므로 안정적인 코드만 merge한다.

**main merge 조건**

- dev 브랜치에서 기능 테스트 완료
- 주요 기능 정상 동작 확인
- 배포 환경변수 확인
- 빌드 성공
- 팀원 동의 후 merge

**main 브랜치 금지 사항**

- 직접 push 금지
- 테스트되지 않은 기능 merge 금지
- 개인 작업 브랜치에서 바로 main으로 PR 금지

운영 배포는 반드시 `feat/* → dev → main` 흐름을 따른다.

## 9. dev 브랜치 관리 규칙

- 모든 기능 브랜치는 dev에서 생성한다.
- 기능 개발 전 항상 dev를 최신화한다.
- dev에 merge하기 전 충돌 여부를 확인한다.
- dev에 merge된 기능은 개발 서버에서 테스트한다.

기능 개발 전 권장 명령어:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/기능명
```

작업 중 dev 변경사항 반영:

```bash
git checkout dev
git pull origin dev
git checkout feat/기능명
git merge dev
```

rebase를 사용할 수도 있지만, 팀 규칙이 익숙하지 않다면 merge 방식을 사용한다.

## 10. 커밋 메시지 규칙

커밋 메시지는 작업 내용을 간단히 알 수 있도록 작성한다.

**형식**

```text
<type>: WBS<작업번호 4자리> <작업 항목> <진행 상태>
```

**예시**

```text
feat: WBS0306 질문 수정 API 구현 완료
```

**type 예시**

| type | 의미 |
|---|---|
| `feat` | 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `docs` | 문서 수정 |
| `chore` | 설정, 빌드, 의존성 작업 |
| `style` | 코드 포맷 수정 |
| `test` | 테스트 코드 작성 |

## 11. 역할별 브랜치 예시

| 담당 기능 | 브랜치 |
|---|---|
| 인증 / 회원 | `feat/auth`, `feat/member` |
| 마이페이지 | `feat/mypage` |
| 질문 | `feat/question` |
| 답변 | `feat/answer` |
| 댓글 | `feat/comment` |
| 좋아요 | `feat/like` |
| 태그 / 검색 / 필터 | `feat/tag`, `feat/search-filter` |
| 이미지 업로드 | `feat/image-upload` |
| 알림 | `feat/notification` |
| 배포 | `feat/deploy` 또는 `deploy/server` |

## 12. 충돌 방지 규칙

팀원이 동시에 작업하므로 충돌 방지를 위해 다음 규칙을 지킨다.

- 작업 시작 전 항상 dev 최신화
- 한 PR에 너무 많은 기능을 넣지 않기
- 공통 파일 수정 시 Slack에 공유
- 패키지 구조, 공통 응답, 예외 처리 수정 시 팀원과 먼저 합의
- DB 스키마 변경 시 Flyway 버전을 Slack에 공유
- API URL 변경 시 프론트/백엔드 모두 공유
- `.env`, 설정 파일 변경 시 공유

특히 충돌 가능성이 높은 파일은 수정 전에 공유한다.

- `application.yml`
- `SecurityConfig`
- `WebConfig`
- 공통 응답 클래스
- 공통 예외 클래스
- 라우팅 설정
- API 클라이언트 설정

## 13. 최종 브랜치 전략 요약

```
feat/* 브랜치에서 기능 개발
→ dev 브랜치로 PR
→ 코드 리뷰 후 merge
→ 개발 서버 배포 및 테스트
→ 기능 안정화 후 main 브랜치로 PR
→ 운영 서버 배포
```

운영 서버와 개발 서버는 다음과 같이 구분한다.

| 브랜치 | 배포 대상 |
|---|---|
| `main` | `foryou.abcganada.xyz` |
| `dev` | `foryou-dev.abcganada.xyz` |
| `feat/*` | 로컬 개발 |

이 전략을 통해 기능 개발, 개발 서버 테스트, 운영 배포를 분리하여 안정적으로
협업할 수 있다.

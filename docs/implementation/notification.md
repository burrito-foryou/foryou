# 실시간 알림

## 알림 생성

- 답변 등록/채택, 댓글, 좋아요가 발생하면 해당 도메인이 발행하는 Spring 이벤트를 받아
  알림(notification)을 생성합니다. 도메인 간 결합 없이 느슨하게 연결됩니다.

## 실시간 전달

- Server-Sent Events(SSE)로 생성된 알림을 클라이언트에 즉시 push합니다.
- 같은 계정으로 여러 탭을 열어도 각 탭이 독립적으로 구독을 유지하도록 처리했습니다
  (멀티탭 지원).

## 데이터 모델

- `notifications`는 `targetType + targetId` 조합으로 알림 대상(질문/답변/댓글)을
  가리키는 polymorphic 참조를 사용합니다. 대상이 테이블마다 달라질 수 있어 이 부분은
  DB FK 없이 애플리케이션에서 참조 무결성을 검증합니다.
- `question_id`, `question_title`을 비정규화 컬럼으로 함께 저장해, 알림 목록 조회 시마다
  질문 테이블까지 조인하지 않고 바로 제목을 보여줍니다.

## API

| Method | 경로                           | 설명                 |
| ------ | ------------------------------ | -------------------- |
| GET    | `/api/notifications`           | 알림 목록            |
| PATCH  | `/api/notifications/{id}/read` | 알림 읽음 처리       |
| PATCH  | `/api/notifications/read-all`  | 전체 읽음 처리       |
| DELETE | `/api/notifications/{id}`      | 알림 삭제            |
| DELETE | `/api/notifications`           | 전체 알림 삭제       |
| GET    | `/api/notifications/subscribe` | SSE 실시간 알림 구독 |

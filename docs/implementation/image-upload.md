# 이미지 업로드

## 저장소

- Cloudinary와 연동해 질문/답변 첨부 이미지와 회원 프로필 이미지를 업로드·교체합니다.

## 데이터 모델

- `images`는 `targetType`(QUESTION/ANSWER/MEMBER) + `targetId` 조합으로 대상을 가리키는
  polymorphic 참조를 사용하고, 다른 테이블처럼 FK 컬럼을 두지 않습니다. 대상 테이블이
  질문/답변/회원으로 다양해 DB FK 대신 애플리케이션에서 참조 무결성을 검증합니다.

## API

| Method | 경로                                  | 설명                      |
| ------ | ------------------------------------- | ------------------------- |
| POST   | `/api/images/questions/{questionId}`  | 질문 이미지 업로드        |
| POST   | `/api/images/answers/{answerId}`      | 답변 이미지 업로드        |
| POST   | `/api/images/profile`                 | 프로필 이미지 업로드/교체 |
| GET    | `/api/images/{targetType}/{targetId}` | 대상별 이미지 목록        |
| DELETE | `/api/images/{imageId}`               | 이미지 삭제               |

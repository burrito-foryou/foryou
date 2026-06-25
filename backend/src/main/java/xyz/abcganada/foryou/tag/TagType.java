package xyz.abcganada.foryou.tag;

/**
 * 태그 종류를 구분하는 Enum
 * 질문 작성 시 선택하는 조건 카테고리를 나타낸다
 */
public enum TagType {
    TARGET,     // 대상 (친구, 연인, 부모님 등)
    BUDGET,     // 예산 (1만원 이하, 3~5만원 등)
    GENDER,     // 성별 (남성, 여성, 무관)
    AGE_GROUP,  // 나이대 (10대, 20대, 30대 등)
    SITUATION,  // 상황 (생일, 졸업, 집들이 등)
    CATEGORY,   // 카테고리 (음식, 패션, 디지털 등)
    GIFT_TYPE   // 선물 유형 (음식, 물건, 옷 등)
}
import instance from "../../../shared/api/instance";

// 태그 전체 조회 (type 파라미터 있으면 해당 타입만, 없으면 전체)
export const getTags = (type) =>
    instance
        .get("/tags", { params: type ? { type } : {} })
        .then((res) => res.data.data);
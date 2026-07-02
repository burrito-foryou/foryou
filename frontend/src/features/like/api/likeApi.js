import instance from "../../../shared/api/instance";

export const getLikeStatus = (targetType, targetId) =>
  instance
    .get("/likes/status", { params: { targetType, targetId } })
    .then((res) => res.data.data);
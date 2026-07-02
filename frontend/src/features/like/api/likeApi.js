import instance from "../../../shared/api/instance";

export const getLikeStatus = (targetType, targetId) =>
  instance
    .get("/likes/status", { params: { targetType, targetId } })
    .then((res) => res.data.data
  );

export const addLike = (targetType, targetId) =>
  instance
    .post("/likes", { targetType, targetId })
    .then((res) => res.data.data);

export const cancelLike = (targetType, targetId) =>
  instance
    .delete("/likes", { data: { targetType, targetId } })
    .then((res) => res.data.data);
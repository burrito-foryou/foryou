import instance from "../../../shared/api/instance";

export const getNotifications = () => {
    return instance.get("/notifications").then((res) => res.data.data);
};

export const markAsRead = (notificationId) => {
    return instance.patch(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = () => {
    return instance.patch("/notifications/read-all");
};

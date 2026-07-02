import instance from "../../../shared/api/instance";

export const getNotifications = (receiverId) => {
    return instance.get("/notifications", {
            params: { receiverid },
        })
        .then((res) => res.data.data);
};

export const markAsRead = (notificationId, receiverId) => {
    return instance.patch(`/notifications/${notificationId}/read`, null, {
        params: { receiverId },
    });
};

export const markAllAsRead = (receiverId) => {
    return instance.patch("/notifications/read-all", null, {
        params: { receiverId },
    })
};
import instance from "../../../shared/api/instance";

export const getMyInfo = () =>
  instance.get("/members/me").then((res) => res.data.data);

export const updateNickname = (nickname) =>
  instance.patch("/members/me", { nickname }).then((res) => res.data.data);

export const updateProfileImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return instance
    .post("/images/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.data);
};

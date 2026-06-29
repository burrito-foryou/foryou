import { useState } from "react";
import { signup } from "../api/authApi";

const VALIDATORS = {
  nickname: (v) =>
    !v
      ? "닉네임은 필수입니다."
      : !/^[가-힣a-zA-Z0-9]{2,20}$/.test(v)
        ? "닉네임은 2~20자이며, 한글·영문·숫자만 사용할 수 있습니다."
        : "",
  email: (v) =>
    !v
      ? "이메일은 필수입니다."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? "이메일 형식이 올바르지 않습니다."
        : "",
  password: (v) =>
    !v
      ? "비밀번호는 필수입니다."
      : !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/])\S{8,20}$/.test(
            v,
          )
        ? "비밀번호는 8~20자이며, 영문·숫자·특수문자를 포함해야 합니다."
        : "",
  passwordConfirm: (v, form) =>
    !v
      ? "비밀번호 확인은 필수입니다."
      : v !== form.password
        ? "비밀번호가 일치하지 않습니다."
        : "",
};

const useSignupForm = () => {
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: VALIDATORS[name](value, { ...form, [name]: value }),
    }));
  };

  const validate = () => {
    const newErrors = Object.fromEntries(
      Object.entries(VALIDATORS).map(([field, fn]) => [
        field,
        fn(form[field], form),
      ]),
    );
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signup({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
      });
      setShowModal(true);
    } catch (error) {
      const message =
        error.response?.data?.message ?? "회원가입에 실패했습니다.";
      setErrors((prev) => ({ ...prev, server: message }));
    }
  };

  return { form, errors, handleChange, handleSubmit, showModal };
};

export default useSignupForm;

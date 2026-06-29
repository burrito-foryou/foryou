import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { login } from "../api/authApi";
import useAuthStore from "../store/authStore";

const VALIDATORS = {
  email: (v) =>
    !v
      ? "이메일은 필수입니다."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? "이메일 형식이 올바르지 않습니다."
        : "",
  password: (v) => (!v ? "비밀번호는 필수입니다." : ""),
};

const useLoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: VALIDATORS[name](value) }));
  };

  const validate = () => {
    const newErrors = Object.fromEntries(
      Object.entries(VALIDATORS).map(([field, fn]) => [field, fn(form[field])]),
    );
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { data } = await login({
        email: form.email,
        password: form.password,
      });
      setAuth(data.data.accessToken);
      navigate(ROUTES.HOME);
    } catch (error) {
      const message = error.response?.data?.message ?? "로그인에 실패했습니다.";
      setErrors((prev) => ({ ...prev, server: message }));
    }
  };

  return { form, errors, handleChange, handleSubmit };
};

export default useLoginForm;

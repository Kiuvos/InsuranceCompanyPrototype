"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/services/api";

export function useAuthForm(mode: "login" | "register") {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return false;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        await registerUser(email, password);
        setMessage("Registro exitoso. Ya puedes iniciar sesión.");
        return true;
      }

      const response = await loginUser(email, password);
      if (!response.ok) {
        setError(response.message);
        return false;
      }

      setMessage(response.message);
      return true;
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    message,
    error,
    submit,
  };
}

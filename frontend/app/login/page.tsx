"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthCard from "../../components/AuthCard";
import { Auth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        form
      );
      Auth.saveUser(res.data.token, res.data.user);
      const redirect = res.data.user.role === "BUYER" ? "/buyer" : "/supplier";
      router.push(redirect);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <AuthCard
      title="Login to Your Account"
      footer={
        <p>
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      {message && <p className="text-red-600 mt-3 text-center">{message}</p>}
    </AuthCard>
  );
}


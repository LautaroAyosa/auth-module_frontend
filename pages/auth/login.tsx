import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import AuthError from "@/components/AuthError";
import Link from "next/link";
import { login } from "@/utils/auth";
import Layout from "./layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const {mfaRequired, tempSessionId} = await login(email, password);
      
      if (mfaRequired) {
        router.push(`/auth/${tempSessionId}`)
      } else {
        router.push('/')
      }

    } catch (err) {
      if (axios.isAxiosError(err))
        setError(err.response?.data?.message || "Login Failed.");
      else setError("An unexpected error occurred.");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
        Sign In
      </h1>
      <form onSubmit={handleLogin} className="">
        <FormInput
          label="Email address"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email address"
        />
        <FormInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="●●●●●●●●"
          description="Must be at least 8 characters long."
        />
        <AuthError message={error} />
        <Button type="submit">
          Login
        </Button>
      </form>
      <div className="mt-4 flex justify-between text-sm text-blue-600">
        <Link className="hover:text-blue-500 hover:underline" href="/auth/register">Don&apos;t have an account? <br></br> Register</Link>
        <Link className="hover:text-blue-500 hover:underline text-end" href="/auth/forgot-password">Forgot <br></br> Password?</Link>
      </div>
    </Layout>
  );
}
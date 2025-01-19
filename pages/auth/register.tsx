// pages/auth/register.tsx
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import AuthError from "@/components/AuthError";
import Link from "next/link";
import Layout from "./layout";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      router.push("/dashboard");
      console.log(data)
    } catch (err) {
        if (axios.isAxiosError(err)) {
          // If the error is an AxiosError, access the response property safely
          setError(err.response?.data?.message || "Registration Failed.");
        } else {
          // Handle unexpected errors
          setError("An unexpected error occurred.");
        }
      }
    
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Register</h2>
      <form onSubmit={handleRegister}>
        <FormInput
          label="Full name"
          type="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormInput
          label="Email address"
          type="email"
          placeholder="name@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="●●●●●●●●"
          description="Must be at least 8 characters long."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthError message={error} />
        <Button type="submit">Register</Button>
      </form>
      <div className="mt-4 flex justify-between text-sm text-blue-600">
        <Link className="hover:text-blue-500 hover:underline" href="/auth/login">Already have an account? <br></br> Log In</Link>
        <Link className="hover:text-blue-500 hover:underline text-end" href="/auth/forgot-password">Forgot <br></br> Password?</Link>
      </div>
    </Layout>
  );
};

export default Register;
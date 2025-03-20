// pages/auth/register.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import AuthError from "@/components/auth/AuthError";
import Link from "next/link";
import AuthLayout from "../../components/layout/AuthLayout";
import Layout from "../../components/layout/MainLayout";
import { register } from "@/utils/auth";
import { toast } from "react-toastify";

function Register () {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const registerPromise = register(name, email, password);

    await toast.promise(
      registerPromise, 
      {
        pending: "Registering...",
        success: "Registered successfully. Please log in.",
        error: "Failed to Register"
      }
    );

    router.push("/auth/login");

  };

  return (
    <>
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
    </>
  );
};

Register.getLayout = (page:React.ReactNode) => <Layout><AuthLayout>{page}</AuthLayout></Layout>

export default Register;
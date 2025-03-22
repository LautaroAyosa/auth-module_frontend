import { useContext, useState } from "react";
import { useRouter } from "next/router";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { login } from "@/utils/auth";
import Layout from "../../components/layout/MainLayout";
import AuthLayout from "../../components/layout/AuthLayout";
import { AuthContext } from "../_app";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setAuth} = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginPromise = login(email, password, setAuth);      
    const {mfaRequired, tempSessionId, message} = await toast.promise(
      loginPromise, 
      {
        pending: "Logging in...",
        success: "Logged in successfully",
        error: "Failed to log in"
      }
    );
    
    if (mfaRequired) {
      router.push(`/auth/${tempSessionId}`)
    } else if (message) {
      router.push('/')
    }
  };

  return (
    <>
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
        <Button type="submit">
          Login
        </Button>
      </form>
      <div className="mt-4 flex justify-between text-sm text-blue-600">
        <Link className="hover:text-blue-500 hover:underline" href="/authentication/register">Don&apos;t have an account? <br></br> Register</Link>
        <Link className="hover:text-blue-500 hover:underline text-end" href="/authentication/forgot-password">Forgot <br></br> Password?</Link>
      </div>
    </>
  );
}

Login.getLayout = (page:React.ReactNode) => <Layout><AuthLayout>{page}</AuthLayout></Layout>

export default Login;
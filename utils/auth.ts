import apiClient from "./axiosInstance";
import { AuthState, User } from "@/pages/_app";


export async function isLoggedIn(
  setAuth?: (newState: AuthState) => void,
): Promise<{ authenticated: boolean; user: User | null }> {
  try {
    const response = await apiClient.get('/validate-session');
    const authData = { authenticated: true, user: response.data.user };

    // Update Context
    if (setAuth) setAuth(authData); 

    return authData;
  } catch (err) {
    console.error('Unexpected error checking session:', err);

    const authData = { authenticated: false, user: null };
    if (setAuth) setAuth(authData);
    
    throw err;
  }
}

export async function register(
  name: string, 
  email:string, 
  password:string,
): Promise<{message?:string}> {
  try {
    const res = await apiClient.post('/register', {name, email, password});
    return {message: res.data.message}
  } catch (err) {
    console.error("Error registering:", err)
    throw err;
  }
}


// Login function
export async function login(
  email: string, 
  password: string, 
  setAuth?: (newState: AuthState) => void,
): Promise<{ mfaRequired?: boolean; tempSessionId?: string, message?:string, error?:string }> {
  try {
    const res = await apiClient.post('/login', { email, password });
    if (res?.data?.mfaRequired) {
      return { mfaRequired: true, tempSessionId: res?.data?.tempSessionId };
    }

    const sessionData = await isLoggedIn();
    
    if (setAuth) setAuth(sessionData);

    return { mfaRequired: false, message: 'Login successful' };
  } catch (err) {
    console.error("Error logging in:", err)
    throw err;
  }
}

export async function requestPasswordReset(email: string): Promise<{message:string}> {
  try {
    const res = await apiClient.post('/request-reset-password', { email });
    return { message: res.data.message };
  } catch (err) {
    console.error("Error requesting password reset:", err)
    throw err;
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<{message:string}> {
  try {
    const res = await apiClient.post('/reset-password', { token, newPassword });
    return { message: res.data.message };
  } catch (err) {
    console.error("Error resetting password:", err)
    throw err;
  }
}


export async function updateUser(
  name?: string,
  email?: string,
  password?: string,
  confirmPassword?: string,
  setAuth?: (newState: AuthState | ((prev: AuthState) => AuthState)) => void,
): Promise<{ message: string }> {
  try {
    const res = await apiClient.put('/update-user', {name, email, password, confirmPassword});

    if (setAuth) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: prevAuth.user
          ? { ...prevAuth.user, ...res.data.user }
          : null,
      }));
    }
    return res.data.message;
  } catch (err) {
    console.error("Error updating user:", err)
    throw err
  }
}

export async function updateEmail(
  token:string, 
  setAuth?: (newState: AuthState | ((prev: AuthState) => AuthState)) => void,
): Promise<{message: string}> {
  try {
    const res = await apiClient.put(`/update-email/${token}`);

    if (setAuth) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: prevAuth.user
          ? { ...prevAuth.user, email: res.data.email ?? prevAuth.user.email }
          : null,
      }));
    }

    return res.data.message;
  } catch (err) {
    console.error("Error updating user:", err)
    throw err
  }
}

export async function enableMFA(
  setAuth?: (newState: AuthState | ((prev: AuthState) => AuthState)) => void,
):Promise<{message?:string, qrCode?:string, recoveryCode?:string}> {
  try {
    const {data} = await apiClient.post('/enable-mfa'); // {message: 'MFA enabled', qrCode, recoveryCode}
    if (setAuth) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: prevAuth.user ? { ...prevAuth.user, mfaEnabled: true } : null,
      }));
    }
    return { message: data.message, qrCode: data.qrCode, recoveryCode: data.recoveryCode };
  } catch (err) {
    console.error("Error enabling MFA:", err)
    throw err
  }
}

// MFA Verification function
export async function verifyMFA(
  tempSessionId: string, 
  token: string, 
  setAuth?: (newState: AuthState) => void,
): Promise<{message?:string}> {
  try {
    const res = await apiClient.post('/verify-mfa', { tempSessionId, token });
    if (setAuth) setAuth(res.data)
    return { message: res.data.message };
  } catch (err) {
    console.error("Error verifying MFA:", err)
    throw err
  }
}

export async function recoverMFA (
  email:string, 
  recoveryCode:string, 
  setAuth?: (newState: AuthState | ((prev: AuthState) => AuthState)) => void,
): Promise<{message?:string}> {
  try {
    const res = await apiClient.post('/recover-mfa', {email, recoveryCode})
    if (setAuth) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: prevAuth.user ? { ...prevAuth.user, mfaEnabled: false } : null,
      }));
    }

    return {message: res.data.message}
  } catch (err) {
    console.error("Error recovering MFA:", err)
    throw err
  }
}

// Logout function
export async function logout(
  setAuth?: (newState: AuthState) => void,
): Promise<{message?:string}> {
  try {
    const res = await apiClient.post('/logout', {});
    if(setAuth) setAuth({authenticated: false, user: null})
    return {message: res.data.message}  
  } catch (err) {
    console.error("Error logging out:", err)
    throw err
  }
}
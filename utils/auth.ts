import apiClient from "./axiosInstance";

// Store the access token in memory
let accessToken: string | null = null;

export async function isLoggedIn(): Promise<{ authenticated: boolean; user?: { id: string; name: string; email: string; role: string; mfaEnabled: boolean } }> {
  try {
      const response = await apiClient.get('/validate-session')
      return response.data; // { authenticated: true, user: { id, name, email, role, mfaEnabled } }
      // eslint-disable-next-line
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { authenticated: false };
    }
    console.error('Unexpected error checking session:', error.response?.data || error);
    return {authenticated: false};
  }
}

// Login function
export async function login(email: string, password: string): Promise<{ mfaRequired?: boolean; tempSessionId?: string }> {
  try {
      const { data } = await apiClient.post('/login', { email, password });
      if (data.mfaRequired) {
          return { mfaRequired: true, tempSessionId: data.tempSessionId };
      }
      return { mfaRequired: false };
  } catch (error: any) {
      console.error('Login failed:', error.response?.data || error);
      throw error;
  }
}

export async function enableMFA():Promise<{message?:string, qrCode?:string, recoveryCode?:string}> {
  try {
    const {data} = await apiClient.post('/enable-mfa'); // {message: 'MFA enabled', qrCode, recoveryCode}
    return { message: data.message, qrCode: data.qrCode, recoveryCode: data.recoveryCode };
  } catch (err) {
    console.log(err)
    return {message: 'Failed Enabling MFA'}
  }
}

// MFA Verification function
export async function verifyMFA(tempSessionId: string, token: string): Promise<void> {
  try {
    await apiClient.post('/verify-mfa', { tempSessionId, token });

  } catch (error: any) {
      console.error('MFA verification failed:', error.response?.data || error);
      throw error;
  }
}

export async function recoverMFA (email:string, recoveryCode:string): Promise<void> {
  try {
    await apiClient.post('/recover-mfa', {email, recoveryCode})
  } catch (err) {
    throw err;
  }
}

// Logout function
export async function logout(): Promise<void> {
  try {
      await apiClient.post('/logout', {});
      accessToken = null; // Clear access token from memory
      console.log('Logged out successfully');
  } catch (error: any) {
      console.error('Logout failed:', error.response?.data || error);
  }
}

// Example usage for API request
export async function getProtectedResource<T>(): Promise<T> {
  try {
      const { data } = await apiClient.get<T>('/protected');
      return data;
  } catch (error: any) {
      console.error('Error fetching protected resource:', error.response?.data || error);
      throw error;
  }
}

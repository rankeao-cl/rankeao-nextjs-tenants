export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
  tenant_id?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

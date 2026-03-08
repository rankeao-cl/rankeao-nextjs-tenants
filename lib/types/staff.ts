export interface StaffMember {
  id: number;
  username: string;
  display_name?: string;
  avatar_url?: string;
  email: string;
  role: string;
  is_active: boolean;
  joined_at: string;
  deactivated_at?: string;
  notes?: string;
  role_grants: string[];
  overrides: unknown[];
  effective_grants: string[];
}

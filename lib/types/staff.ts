export interface StaffMember {
  id: string;
  name?: string;
  username?: string;
  email: string;
  role: string;
  status: string;
  [key: string]: unknown;
}

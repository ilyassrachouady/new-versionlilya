export type AdminRole = "owner" | "admin";

export type AdminProfile = {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
};

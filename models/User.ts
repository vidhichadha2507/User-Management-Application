import { Role, User } from "@prisma/client";

export interface OrganizationModel {
  label: string;
  value: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  manager: Manager;
}

export interface Manager {
  email: string;
  emailVerified: string;
  id: string;
  image: string | null;
  isTwoFactorEnabled: boolean;
  name: string;
  password: string;
  role: Role;
}

export interface OrganizationUsers {
  id: string;
  name: string;
  managerId: string | null;
  users?: User[];
}

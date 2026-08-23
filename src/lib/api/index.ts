import { apiFetch } from "./client";
import type {
  Contract,
  CreateContractInput,
  CreateOrganizationInput,
  CreatePartyInput,
  CreatePropertyInput,
  CreateSignatureInput,
  CreateUserInput,
  LoginInput,
  Organization,
  Party,
  Property,
  User,
  ContractSignature,
} from "./types";

export const authApi = {
  login: (input: LoginInput) =>
    apiFetch<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () =>
    apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" }),
  me: () => apiFetch<User>("/auth/me"),
};

export const organizationsApi = {
  list: () => apiFetch<Organization[]>("/organizations"),
  get: (id: string) => apiFetch<Organization>(`/organizations/${id}`),
  create: (input: CreateOrganizationInput) =>
    apiFetch<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

export const usersApi = {
  list: () => apiFetch<User[]>("/users"),
  get: (id: string) => apiFetch<User>(`/users/${id}`),
  create: (input: CreateUserInput) =>
    apiFetch<User>("/users", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<User>(`/users/${id}`, { method: "DELETE" }),
};

export const propertiesApi = {
  list: () => apiFetch<Property[]>("/properties"),
  get: (id: string) => apiFetch<Property>(`/properties/${id}`),
  create: (input: CreatePropertyInput) =>
    apiFetch<Property>("/properties", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<CreatePropertyInput>) =>
    apiFetch<Property>(`/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<Property>(`/properties/${id}`, { method: "DELETE" }),
};

export const partiesApi = {
  list: () => apiFetch<Party[]>("/parties"),
  get: (id: string) => apiFetch<Party>(`/parties/${id}`),
  create: (input: CreatePartyInput) =>
    apiFetch<Party>("/parties", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<CreatePartyInput>) =>
    apiFetch<Party>(`/parties/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<Party>(`/parties/${id}`, { method: "DELETE" }),
};

export const contractsApi = {
  list: () => apiFetch<Contract[]>("/contracts"),
  get: (id: string) => apiFetch<Contract>(`/contracts/${id}`),
  create: (input: CreateContractInput) =>
    apiFetch<Contract>("/contracts", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<CreateContractInput> & { signedAt?: string }) =>
    apiFetch<Contract>(`/contracts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<Contract>(`/contracts/${id}`, { method: "DELETE" }),
  addSignature: (id: string, input: CreateSignatureInput) =>
    apiFetch<ContractSignature>(`/contracts/${id}/signatures`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

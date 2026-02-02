export type Role = "ADMIN_CONDOMINIO" | "SINDICO" | "PORTARIA" | "MORADOR";

export function hasRole(userRoles: string[] | undefined, role: Role) {
  return (userRoles ?? []).includes(role);
}

export function hasAnyRole(userRoles: string[] | undefined, roles: Role[]) {
  return roles.some((r) => (userRoles ?? []).includes(r));
}

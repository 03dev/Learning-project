export const Roles = {
    USER: "USER",
    ADMIN: "ADMIN"
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
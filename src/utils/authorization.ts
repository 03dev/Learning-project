export function isAdmin(user: {role: string}) {
    return user.role === "ADMIN";
}
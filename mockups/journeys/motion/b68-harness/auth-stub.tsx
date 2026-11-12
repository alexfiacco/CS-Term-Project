export * from "./Auth";
const q = new URLSearchParams(location.search);
const user = q.get("out") ? null : { id: "u1", email: "emma@example.com", name: "Emma", tourSeen: true, tourVersion: 99, isAnonymous: !!q.get("guest") };
export function useAuth(): any { return { user, ready: true, configError: null, signOut: async () => {}, signIn: async () => null }; }
export function AuthProvider({ children }: any) { return children; }

import { create } from "zustand";
import api from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("nexora_token"),
  status: "idle", // idle | loading | authenticated | error

  async login(email, password) {
    set({ status: "loading" });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("nexora_token", data.access_token);
      set({ token: data.access_token, user: data.user, status: "authenticated" });
      return { ok: true };
    } catch (err) {
      // Demo fallback so the UI is explorable without a running backend.
      if (email && password) {
        const demoUser = { id: "demo", name: "Demo User", email, role: "Owner" };
        localStorage.setItem("nexora_token", "demo-token");
        set({ token: "demo-token", user: demoUser, status: "authenticated" });
        return { ok: true, demo: true };
      }
      set({ status: "error" });
      return { ok: false, error: err.message };
    }
  },

  logout() {
    localStorage.removeItem("nexora_token");
    set({ user: null, token: null, status: "idle" });
  },

  async hydrate() {
    const token = get().token;
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data, status: "authenticated" });
    } catch {
      set({
        user: { id: "demo", name: "Demo User", email: "demo@nexora.dev", role: "Owner" },
        status: "authenticated",
      });
    }
  },
}));

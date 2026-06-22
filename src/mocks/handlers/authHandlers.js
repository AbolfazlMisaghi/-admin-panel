import { http, HttpResponse } from "msw";
import db from "../db";

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json();
    const user = db.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }
    // JWT ساده شبیه‌سازی شده
    const token = "fake-jwt-token-" + user.id;
    return HttpResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  }),
];

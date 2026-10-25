import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  plugins: [jwt()],
});
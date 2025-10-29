import { redirect } from "@tanstack/react-router";
import ky from "ky";

import { getAuthValueFromStorage, signOut } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = ky.create({
  prefixUrl: BASE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const authInfo = getAuthValueFromStorage();
        request.headers.set("Authorization", `Bearer ${authInfo?.accessToken}`);
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        if (response.status === 401) {
          await signOut();
          redirect({ to: "/log-in" });
        }
        return response;
      },
    ],
  },
});

export const apiAuth = ky.create({
  prefixUrl: BASE_URL,
  hooks: {
    afterResponse: [
      async (_, __, response) => {
        if (!response.ok) {
          const body: {
            message: string;
          } = await response.json();
          throw new Error(body.message);
        }
      },
    ],
  },
});

export default api;

import Cookies from "js-cookie";
import { Client } from "@scinorandex/rpscin/dist/client";
import { Browser } from "@scinorandex/rpscin/dist/envs/browser";
import type { AppRouter } from "../server";

export const client = Client<AppRouter>({
  apiLink: "/api",
  serializer: Browser.serializer,
  generateHeaders: () => ({
    // "x-csrf-token": Cookies.get("csrfToken") ?? "",
  }),
});

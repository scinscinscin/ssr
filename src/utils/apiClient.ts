import Cookies from "js-cookie";
import { Client, generateErrorFromResponse } from "@scinorandex/rpscin/dist/client";
import { Browser } from "@scinorandex/rpscin/dist/envs/browser";
import type { AppRouter } from "../server";

const API_LINK = `ws://localhost:8001/api`;

export const client = Client<AppRouter>({
  apiLink: "/api",
  serializer: Browser.serializer,
  generateHeaders: () => ({
    // "x-csrf-token": Cookies.get("csrfToken") ?? "",
  }),

  // @ts-ignore
  wsClient: (link: string) => {
    const socket = new WebSocket(`${API_LINK}${link}`);

    return new Promise((resolve, reject) => {
      const eventHandlerMap = new Map<string, any>();

      socket.addEventListener("open", () => {
        socket.addEventListener("message", ({ data: stringified }) => {
          if (stringified === "@scinorandex/erpc -- stabilize") {
            resolve({
              emit: (eventName: string, data: any) => socket.send(JSON.stringify({ eventName, data })),
              on: (eventName: string, handler: (data: any) => void) => eventHandlerMap.set(eventName, handler),
            });
          } else {
            const { eventName, data } = JSON.parse(stringified);
            if (eventHandlerMap.has(eventName)) eventHandlerMap.get(eventName)(data);
          }
        });
      });

      socket.addEventListener("close", (closeEvent) => {
        try {
          const response = JSON.parse(closeEvent.reason.toString());
          const error = generateErrorFromResponse(response);
          if (error) reject(error);
          else reject(new Error("Response was not ERPC Compliant"));
        } catch (err) {}
      });
    });
  },
});

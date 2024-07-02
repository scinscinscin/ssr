import Cookies from "js-cookie";
import { Client } from "@scinorandex/rpscin/dist/client";
import { Browser } from "@scinorandex/rpscin/dist/envs/browser";

/** Use the ExportedApi import instead when working on only frontend to get faster typescript performance */
import type { AppRouter } from "../server";
// import type { ExportedApi as AppRouter } from "../exportedApi";

import { TypedDocumentNode, ResultOf, VariablesOf } from "@graphql-typed-document-node/core";
import { print } from "graphql";

export const client = Client<AppRouter, WebSocket>({
  wsClient: Browser.generateWebSocketClient("ws://localhost:8000/api"),
  serializer: Browser.serializer,
  apiLink: "/api",
  generateHeaders: () => ({
    "x-csrf-token": Cookies.get("csrfToken") ?? "",
  }),
});

export async function fetchGQL<K extends TypedDocumentNode<any, any>>(
  fn: (p: { body: { query: string; variables: {} } }) => any,
  document: K,
  args: VariablesOf<K>
): Promise<ResultOf<K>> {
  return await fn({ body: { query: print(document), variables: args ?? {} } });
}

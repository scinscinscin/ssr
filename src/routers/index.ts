import { Connection, ERPCError, wsValidate } from "@scinorandex/erpc";
import { createWebSocketEndpoint, getRootRouter } from "@scinorandex/rpscin";
import { z } from "zod";
import { baseProcedure } from "../utils/auth.js";
import { buildSchema, graphql } from "graphql";
import { rootValue, schema } from "./graphql.js";

const builtSchema = buildSchema(schema);

type Endpoint = {
  Receives: {};
  Emits: { ping: { date: number }; newLogin: { username: string } };
};
const connections: Set<Connection<Endpoint>> = new Set();

export const unTypeSafeRouter = getRootRouter({
  "/status": {
    get: baseProcedure.use(async () => {
      return {
        status: "ok",
        time: Date.now(),
        timePH: new Date().toLocaleString("en-PH"),
      };
    }),

    /**
     * Create a websocket listener under /api/status that keeps track of new connections
     */
    ws: createWebSocketEndpoint(wsValidate<Endpoint>({}), async ({ conn, params, query }) => {
      console.log("Client has connected");
      connections.add(conn);

      const intervalId = setInterval(() => {
        conn.emit("ping", { date: Date.now() });
      }, 2000);

      conn.socket.on("close", () => {
        console.log("Client has disconnected");
        connections.delete(conn);
        clearTimeout(intervalId);
      });
    }),
  },

  "/broadcast": {
    /**
     * Send a message to every websocket connected to /api/status
     */
    post: baseProcedure.input(z.object({ username: z.string() })).use(async (req, res, { input }) => {
      connections.forEach((conn) => conn.emit("newLogin", { username: input.username }));
      return {};
    }),
  },

  "/graphql": {
    post: baseProcedure.use(async (req, res) => {
      const result = await graphql({
        schema: builtSchema,
        rootValue,
        source: req.body.query,
        variableValues: req.body.variables,
      });

      if (result.data) return result.data as any;

      console.log("graphql errors: ", result.errors);
      throw new ERPCError({ code: "SERVER_ERROR", message: "Bad GraphQL request" });
    }),
  },
});

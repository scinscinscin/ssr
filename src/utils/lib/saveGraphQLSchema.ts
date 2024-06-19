import fs from "fs";
import path from "path";

const BASE = path.join(process.cwd(), "./src/graphql");

export const saveGraphQLSchema = (opts: { namespace: string; schema: string }) => {
  if (process.env.NODE_ENV === "production") return;

  const namespaceFolderPath = path.join(BASE, opts.namespace);
  try {
    fs.mkdirSync(namespaceFolderPath);
  } catch {}

  fs.writeFileSync(path.join(namespaceFolderPath, "schema.graphql"), opts.schema, { encoding: "utf-8" });
};

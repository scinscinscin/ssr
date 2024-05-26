import type { CodegenConfig } from "@graphql-codegen/cli";
import fs from "fs";
import path from "path";

// traverse src and get list of folders with schema.graphql files
function findGraphQlFiles(base: string): string[] {
  const ret = [] as string[];

  const dirents = fs.readdirSync(base, { withFileTypes: true });
  for (const dirent of dirents) {
    const itemName = path.join(base, dirent.name);
    if (dirent.isDirectory()) findGraphQlFiles(itemName).forEach((x) => ret.push(x));
    else if (dirent.isFile() && dirent.name === "schema.graphql") ret.push(itemName);
  }

  return ret;
}

function generateConfig() {
  const graphqlFiles = findGraphQlFiles(path.join(process.cwd(), "./src"));
  const ret: CodegenConfig["generates"] = {};

  for (const file of graphqlFiles) {
    const fileBasePath = path.dirname(file);
    const documentsPath = path.join(fileBasePath, "documents");
    const gqlFolderPath = path.join(fileBasePath, "gql") + "/";

    try {
      fs.mkdirSync(documentsPath);
    } catch (err) {}

    ret[gqlFolderPath] = { preset: "client", schema: file, documents: documentsPath };
  }

  return ret;
}

const config: CodegenConfig = {
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: generateConfig(),
};

export default config;

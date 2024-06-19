import { z } from "zod";
import { defineResolver, defineType, yoko } from "@scinorandex/yoko";
import { saveGraphQLSchema } from "../utils/lib/saveGraphQLSchema.js";

export const Hobby = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const User = z.object({
  id: z.string(),
  name: z.string(),
});

export const hobbies: z.infer<typeof Hobby>[] = [
  { id: "1", name: "Reading", description: "I like to read" },
  { id: "2", name: "Running", description: "I like to run" },
];

export const users: z.infer<typeof User>[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Doe" },
  { id: "3", name: "Mister Doe" },
  { id: "4", name: "Miss Doe" },
];

export const relation = [
  { userId: "1", hobbyId: "1" },
  { userId: "1", hobbyId: "2" },
  { userId: "2", hobbyId: "1" },
  { userId: "3", hobbyId: "1" },
  { userId: "4", hobbyId: "2" },
];

const HobbyValidator = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

const UserValidator = z.object({
  id: z.string(),
  name: z.string(),
});

const UserType = defineType(UserValidator, (defineField) => ({
  hobbies: defineField({
    returns: z.array(HobbyValidator),
    args: undefined,
    resolver: (parent) => {
      return relation.filter((r) => r.userId === parent.id).map((r) => hobbies.find((h) => h.id === r.hobbyId)!);
    },
  }),

  capitalized: defineField({
    // args: z.object({ foo: z.string().nullable() }),
    args: undefined,
    returns: z.string(),
    resolver: (parent, args) => parent.name.toUpperCase(),
  }),
}));

const HobbyType = defineType(HobbyValidator, (defineField) => ({
  users: defineField({
    returns: z.array(UserValidator),
    args: undefined,
    resolver: (parent) => {
      const filtered = relation.filter((r) => r.hobbyId === parent.id);
      return filtered.map((r) => users.find((user) => user.id === r.userId)!);
    },
  }),
}));

const queries = {
  getUser: defineResolver({
    returns: UserValidator,
    args: z.object({ id: z.string() }),
    async resolver({ id }) {
      const user = users.find((user) => user.id === id);
      if (user) return user;
      else throw new Error("User not found");
    },
  }),

  getUsers: defineResolver({
    returns: z.array(UserValidator),
    args: z.object({ id: z.string() }),
    resolver: () => users,
  }),
};

let maxId = 4;
const mutations = {
  createUser: defineResolver({
    returns: UserValidator,
    args: z.object({ name: z.string() }),
    async resolver({ name }) {
      const user = { id: (++maxId).toString(), name };
      users.push(user);
      return user;
    },
  }),
};

export const { schema, rootValue, schemaString } = yoko({
  types: { User: UserType, Hobby: HobbyType },
  queries,
  mutations,
});

// print the schema so graphql-codegen can see it
saveGraphQLSchema({ namespace: "users", schema: schemaString });

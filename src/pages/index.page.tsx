import { PublicLayout } from "../layouts/public";
import { useEffect, useState } from "react";
import { client } from "../utils/apiClient";
import { useForm } from "react-hook-form";
import { graphql } from "../gql";
import { print } from "graphql";
import { TypedDocumentNode, ResultOf, VariablesOf } from "@graphql-typed-document-node/core";

const postsQueryDocument = graphql(/* GraphQL */ `
  query GetUsersWithHobbies($id: String!) {
    getUsers(id: $id) {
      id
      name
      hobbies {
        id
        name
        description
      }
    }
  }
`);

async function grapqhlFetch<K extends TypedDocumentNode<any, any>>(
  link: string,
  document: K,
  args: VariablesOf<K>
): Promise<ResultOf<K>> {
  const parts = link.split("/");
  const clientEndpoint = parts.reduce((acc, cur) => acc[cur] as any, client) as any;
  return await clientEndpoint.post({ body: { query: print(document), variables: args ?? {} } });
}

const Page = PublicLayout.createPage<{}>({
  page() {
    const [names, setNames] = useState([] as string[]);

    useEffect(() => {
      /**
       * Create a websocket connection to /status and listen to `newLogin` events,
       * adding new username to `names` and print the contents
       */
      const subscription = client["/status"].ws({ path: {} });

      subscription.then((conn) => {
        console.log("Connected to websocket server");
        conn.on("newLogin", async ({ username }) => {
          setNames((a) => [...a, username]);
        });
      });

      return () => subscription.close();
    }, []);

    const Form = useForm<{ username: string }>();

    return {
      children: (
        <div>
          {names.length > 0 && (
            <div style={{ border: "2px solid black", margin: "30px 0px", padding: "20px" }}>
              <h3>Names from websocket connection</h3>
              <div>
                {names.map((name, i) => (
                  <h3 key={i}>{name}</h3>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={Form.handleSubmit(({ username }) => {
              /**
               * Send a post request to /api/login to broadcast username to all connected clients
               */
              client["/broadcast"].post({ body: { username } }).then(() => Form.reset({ username: "" }));
            })}
          >
            <label style={{ marginTop: "20px", display: "block", fontWeight: "bold" }}>
              Broadcast username to all clients
            </label>

            <input {...Form.register("username", { required: true })} />
            <button>Submit</button>
          </form>

          <div>
            <button
              onClick={async () => {
                const testing = await grapqhlFetch("/graphql", postsQueryDocument, { id: "testing" });
                console.log(testing.getUsers);
                //                   ^?
              }}
            >
              Click me
            </button>
          </div>
        </div>
      ),
    };
  },
});

export default Page.defaultExport;
export const getServerSideProps = Page.getServerSideProps;

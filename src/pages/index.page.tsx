import { PublicLayoutFrontend } from "../layouts/public.client";
import { PublicLayoutBackend } from "../layouts/public.server";

import { useEffect, useState } from "react";
import { client, fetchGQL } from "../utils/apiClient";
import { useForm } from "react-hook-form";
import { getUsersWithHobbies } from "../graphql/users/documents/getUsersWithHobbies";
import { useSSE } from "../utils/lib/useSSE";

interface PageProps {
  field: string;
}

export default PublicLayoutFrontend.use<PageProps>((args) => {
  const [names, setNames] = useState([] as string[]);

  const FilesLoader = useSSE(async () => {
    if (typeof window === "undefined") {
      const fs = await import("fs/promises");
      return await fs.readdir(process.cwd());
    }
  }, "files");

  console.log(FilesLoader);

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
              const testing = await fetchGQL(client["/graphql"].post, getUsersWithHobbies, { id: "testing" });
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
});

export const getServerSideProps = PublicLayoutBackend.use<PageProps>({
  async getServerSideProps(ctx) {
    return { props: { field: "hehe" } };
  },
});

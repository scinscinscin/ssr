import { PublicLayout } from "../layouts/public";
import { useEffect, useState } from "react";
import { client } from "../utils/apiClient";
import { useForm } from "react-hook-form";

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
        </div>
      ),
    };
  },
});

export default Page.defaultExport;
export const getServerSideProps = Page.getServerSideProps;

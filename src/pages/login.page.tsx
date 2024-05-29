import { PublicLayoutFrontend } from "../layouts/public.client";
import { PublicLayoutBackend } from "../layouts/public.server";
import { client } from "../utils/apiClient";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default PublicLayoutFrontend.use<{}>(() => {
    const LoginForm = useForm<{ username: string; password: string }>();

    return {
      children: (
        <div>
          <h2 style={{ marginTop: "30px" }}>Login Form</h2>

          <form
            onSubmit={LoginForm.handleSubmit(async ({ username, password }) => {
              try {
                await client["/user"]["/login"].post({ body: { username, password } });
                toast.success("Successfully logged in");
              } catch {
                toast.error("Incorrect credentials");
              }
            })}
          >
            <label htmlFor="username">Username</label>
            <input {...LoginForm.register("username", { required: true })} />

            <label htmlFor="password">Password</label>
            <input {...LoginForm.register("password", { required: true })} />
            <button>Login</button>
          </form>
        </div>
      ),
    };
});

export const getServerSideProps = PublicLayoutBackend.use<{}>(() => {});

import { implementLayoutBackend } from "@scinorandex/layout";
import type { PublicLayoutOptions } from "./public.client";

export const PublicLayoutBackend = implementLayoutBackend<PublicLayoutOptions>({
  /**
   * Fetch the created users from the database and return to the layout component
   */
  async getServerSideProps(ctx) {
    const username = ctx.res.locals.user?.username ?? null;
    return { props: { layout: { username } } };
  },

  async executeTransform(context, pageProps) {
    return { "sse.cache": await context.res.locals.generateSse(context, pageProps) };
  },
});

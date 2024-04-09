import { GenerateLayout, GenerateLayoutOptionsImpl } from "@scinorandex/layout";
import { NextSeo, NextSeoProps } from "next-seo";

interface PublicLayoutOptions extends GenerateLayoutOptionsImpl {
  // the page can return NextSeoProps to define the SEO meta tags of the page
  ClientSideLayoutProps: { seo?: NextSeoProps };
  // the layout needs the username of the currently logged in user
  ServerSideLayoutProps: { username: string | null };
}

export const PublicLayout = GenerateLayout<PublicLayoutOptions>({
  /**
   * Create a layout that prints the currently logged in user
   */
  layoutComponent({ internalProps, layoutProps }) {
    return (
      <>
        <NextSeo
          {...{
            title: "@scinorandex/ssr Layout Example",
            description: "A page made with @scinorandex/ssr",
            ...layoutProps.seo,
          }}
        />

        <div>
          <header>
            <h2>@scinorandex/ssr template</h2>
            {internalProps.username && <h3>Logged in as: {internalProps.username}</h3>}
          </header>

          <main>{layoutProps.children}</main>
        </div>
      </>
    );
  },

  /**
   * Fetch the created users from the database and return to the layout component
   */
  async getServerSideProps(ctx) {
    const username = ctx.res.locals.user?.username ?? null;

    return {
      props: { layout: { username } },
    };
  },
});

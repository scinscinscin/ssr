import { GenerateLayout, GenerateLayoutOptionsImpl } from "@scinorandex/layout";
import { NextSeo, NextSeoProps } from "next-seo";
import { db } from "../utils/prisma";

interface PublicLayoutOptions extends GenerateLayoutOptionsImpl {
  // the page can return NextSeoProps to define the SEO meta tags of the page
  ClientSideLayoutProps: { seo?: NextSeoProps };
  // the layout needs the list of users from the DB
  ServerSideLayoutProps: { users: string[] };
}

export const PublicLayout = GenerateLayout<PublicLayoutOptions>({
  /**
   * Create a layout that prints the usernames of accounts in the DB
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
            <h3>Users in DB: {internalProps.users.join(", ")}</h3>
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
    const users = await db.user.findMany();

    return {
      props: { layout: { users: users.map((u) => u.username) } },
    };
  },
});

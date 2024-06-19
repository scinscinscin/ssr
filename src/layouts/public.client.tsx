import { implementLayoutFrontend, GenerateLayoutOptionsImpl } from "@scinorandex/layout";
import { NextSeo, NextSeoProps } from "next-seo";

export interface PublicLayoutOptions extends GenerateLayoutOptionsImpl {
  // the page can return NextSeoProps to define the SEO meta tags of the page
  ClientSideLayoutProps: { seo?: NextSeoProps };
  // the layout needs the username of the currently logged in user
  ServerSideLayoutProps: { username: string | null };
  Transform: { "sse.cache": any };
}

export const PublicLayoutFrontend = implementLayoutFrontend<PublicLayoutOptions>({
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
});

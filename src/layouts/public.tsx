import { GenerateLayout } from "@scinorandex/layout";
import { NextSeo, NextSeoProps } from "next-seo";

export const PublicLayout = GenerateLayout<{
  InternalProps: {};
  LayoutProps: { seo?: NextSeoProps };
  ExportedInternalProps: {};
}>({
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
            <h1>{"this is the header"}</h1>
          </header>

          <main>{layoutProps.children}</main>
        </div>
      </>
    );
  },
});

import { GenerateLayout } from "@scinorandex/layout";

export const PublicLayout = GenerateLayout<{
  InternalProps: { date: string };
  LayoutProps: {};
  ExportedInternalProps: {};
}>({
  async generateInternalProps() {
    return { date: new Date().toString() };
  },

  layoutComponent({ internalProps, layoutProps }) {
    return (
      <div>
        <header>
          <h1>{internalProps.date}</h1>
        </header>

        <main>{layoutProps.children}</main>
      </div>
    );
  },
});

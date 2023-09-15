import { GenerateLayout } from "@scinorandex/layout";
import { serialize, deserialize } from "superjson";

export const PublicLayout = GenerateLayout<{
  InternalProps: { date: Date };
  LayoutProps: {};
  ExportedInternalProps: {};
}>({
  serialize: (original) => serialize(original),
  deserialize: (original) => deserialize(original),

  async generateInternalProps() {
    return { date: new Date() };
  },

  layoutComponent({ internalProps, layoutProps }) {
    return (
      <div>
        <header>
          <h1>{internalProps.date.toString()}</h1>
        </header>

        <main>{layoutProps.children}</main>
      </div>
    );
  },
});

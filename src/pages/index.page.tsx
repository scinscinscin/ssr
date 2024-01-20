import { PublicLayout } from "../layouts/public";

const Page = PublicLayout.createPage<{}>({
  page() {
    return {
      children: <h1>Hello World!</h1>,
    };
  },
});

export default Page.defaultExport;
export const getServerSideProps = Page.getServerSideProps;

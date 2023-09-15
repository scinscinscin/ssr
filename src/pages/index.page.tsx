import { useEffect } from "react";
import { client } from "../utils/apiClient";
import { PublicLayout } from "../layouts/public";

const Page = PublicLayout.createPage<{ set: Set<string> }>({
  async getServerSideProps(ctx) {
    const set = new Set<string>(["testing", "bar", "baz", "qux"]);
    return { props: { set } };
  },

  page({ set }) {
    useEffect(() => {
      client["/status"].get({}).then((res) => console.log(res));
    }, []);

    return {
      children: <h1>Hello World! {set}</h1>,
    };
  },
});

export default Page.defaultExport;
export const getServerSideProps = Page.getServerSideProps;

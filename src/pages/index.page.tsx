import { useEffect } from "react";
import { client } from "../utils/apiClient";
import { PublicLayout } from "../layouts/public";

const Page = PublicLayout.createPage<{}>({
  page(props) {
    useEffect(() => {
      client["/status"].get({}).then((res) => console.log(res));
    }, []);

    return {
      children: <h1>Hello World!</h1>,
    };
  },
});

export default Page.defaultExport;
export const getServerSideProps = Page.getServerSideProps;

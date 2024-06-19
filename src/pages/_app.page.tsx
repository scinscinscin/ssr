import App, { AppProps, AppContext, AppType } from "next/app";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Context, initialRender } from "../utils/lib/sse-context";

const _App: AppType = ({ Component, pageProps }: AppProps) => {
  // the buffer/ polyfill must be imported dynamically otherwise next will try to import it on the server
  // and will SUCCESSFULLY load the regular node module instead of the browser polyfill
  // if you get a base64url error, delete the .next folder and try again
  useEffect(() => {
    if (typeof window !== undefined) {
      import("buffer/").then((m) => {
        // @ts-ignore
        window.Buffer = m.Buffer;
      });
    }
  }, []);

  return (
    <Context>
      <ToastContainer />
      <Component {...pageProps} />
    </Context>
  );
};

_App.getInitialProps = async (appContext: AppContext) => {
  appContext.ctx.res.locals.generateSse = async (gsspContext, pageProps) =>
    await initialRender({ appContext, gsspContext, props: { pageProps } });

  /**
   * What you return here doesn't matter for regular pages
   * but is required for 404 and 500 pages to work
   */
  return App.getInitialProps(appContext);
};

export default _App;

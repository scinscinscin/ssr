import ReactDOMServer from "react-dom/server";
import { AppContext } from "next/app";
import { GetServerSidePropsContext, NextComponentType, NextPageContext } from "next";
import { createServerContext, createBroswerContext } from "./useSSE";
import React from "react";

function getOrCreate() {
  if (typeof window !== "undefined") {
    window._initialDataContext =
      typeof window.__NEXT_DATA__.props?.pageProps?.transform !== "undefined"
        ? window.__NEXT_DATA__.props.pageProps.transform["sse.cache"]
        : {};
    return createBroswerContext();
  }

  return ServerDataContext;
}

type AppPageProps = any;
type WithCTX = NextComponentType<NextPageContext, {}, AppPageProps>;
export const { ServerDataContext, resolveData } = createServerContext();
export const Context = getOrCreate();

interface InitialRenderOptions {
  appContext: AppContext;
  gsspContext: GetServerSidePropsContext;
  props: AppPageProps;
}

export async function initialRender({ appContext, gsspContext, props }: InitialRenderOptions) {
  const WithAppContext: WithCTX = appContext.AppTree;

  try {
    ReactDOMServer.renderToString(
      <Context>
        <WithAppContext {...props} />
      </Context>
    );
  } catch (err) {
    // console.error("error occured in ReactDomServer.renderToString", err);
  }

  const sse = await resolveData({ appContext, gsspContext });
  return sse;
}

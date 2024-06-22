import { User } from "@prisma/client";
import type { Request, Response } from "express";
import type {
  GetServerSidePropsContext as OriginalGetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from "next/types";

import type { AppContext as OriginalAppContext } from "next/dist/pages/_app";

// prettier-ignore
type ProcessOptionalParam<Param extends string> = string extends Param ? {}
  : Param extends `...${infer Catchall}`
    ? { [key in Catchall]: string[] | false }
  : never;

// prettier-ignore
type ProcessRequiredParam<Param extends string> = string extends Param ? {}
  : Param extends `...${infer Catchall}`
    ? { [key in Catchall]: string[] }
    : { [key in Param]: string };

// prettier-ignore
export type Params<Route extends string> = string extends Route ? {}
  : Route extends `${infer Prefix}/[[${infer Param extends string}]]${infer Suffix}`
    ? ProcessOptionalParam<Param> & Params<`${Prefix}${Suffix}`>
  : Route extends `${infer Prefix}/[${infer Param extends string}]${infer Suffix}` 
  ? ProcessRequiredParam<Param> & Params<`${Prefix}${Suffix}`>
  : {};

type _GetServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = OriginalGetServerSidePropsContext<Q, D> & {
  params: Q;
  req: Request;
  res: Response<any, MyLocals>;
};

/**
 * Sets the type of res.locals, which can be accessed using ctx.res.locals
 */
interface MyLocals {
  user: User | null;
  generateSse: (context: _GetServerSidePropsContext, pageProps: any) => Promise<any>;
}

declare module "next" {
  // Changes the type of GetServerSidePropsContext to be of Express Request and Response
  // and also makes Params non optional since @scinorandex/layout explicitly types them
  // https://github.com/vercel/next.js/discussions/36271

  export type GetServerSidePropsContext<
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  > = _GetServerSidePropsContext<Q, D>;

  export type GetServerSideProps<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  > = (context: GetServerSidePropsContext<Q, D>) => Promise<GetServerSidePropsResult<P>>;

  export type GetStaticPropsContext<
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData
  > = OriginalGetStaticPropsContext<Params, Preview> & { params: Params };

  // Also fixes the types of getStaticPaths since the default Next.js types are misleading
  export type GetStaticPaths<Route extends string> = (
    context: GetStaticPathsContext
  ) => Promise<GetStaticPathsResult<Params<Route>>> | GetStaticPathsResult<Params<Route>>;
}

declare module "next/app" {
  export type AppContext = OriginalAppContext & { ctx: { res: Response<any, MyLocals> } };
}

export {};

import { GetServerSidePropsContext } from "next";
import { AppContext } from "next/app";
import React, { useContext } from "react";

declare global {
  interface Window {
    [k: string]: any;
    _initialDataContext: object;
  }
}

interface IInternalContext {
  requests: { promise: (ctx: RequestContext) => Promise<any>; id: string; cancel: Function }[];
  resolved: boolean;
}

interface RequestContext {
  appContext: AppContext;
  gsspContext: GetServerSidePropsContext;
}

interface IDataContext {
  [k: string]: any;
}

export const InternalContext = React.createContext<IInternalContext>({ requests: [], resolved: false });

export const DataContext = React.createContext<IDataContext>({});

type UseSSE<T> = { data: NonNullable<T>; error: null; threw: false } | { data: null; error: any; threw: true };

/**
 * Execute code in the server side and store it for use in the client
 * @param effect function returning promise
 * @param queryKey the unique key for the data that you're fetching
 */
export function useSSE<T>(effect: (ctx: RequestContext) => Promise<T | undefined>, queryKey: string): UseSSE<T> {
  const internalContext: IInternalContext = useContext(InternalContext);

  const ctx: IDataContext = useContext(DataContext);
  const data = ctx[queryKey]?.data || null;
  const error = ctx[queryKey]?.error || null;

  // this code only executes in the server side as Browser internal context has resolved set to true immediately
  if (!internalContext.resolved) {
    let cancel = Function.prototype;

    const promise = (requestContext: RequestContext) =>
      new Promise(async (resolve) => {
        cancel = () => {
          if (!ctx[queryKey]) ctx[queryKey] = { error: { message: "timeout" }, id: queryKey };
          resolve(queryKey);
        };

        ctx[queryKey] = await effect(requestContext)
          .then((data) => ({ data }))
          .catch((error) => ({ error }));
        return resolve(queryKey);
      });

    internalContext.requests.push({ id: queryKey, promise, cancel });
  }

  return { data, error, threw: data == null };
}

export const createBroswerContext = (variableName: string = "_initialDataContext") => {
  const initial = window && window[variableName] ? window[variableName] : {};
  let internalContextValue: IInternalContext = { resolved: true, requests: [] };

  function BroswerDataContext<T extends { children: React.ReactNode }>(props: T) {
    return (
      <InternalContext.Provider value={internalContextValue}>
        <DataContext.Provider value={initial}>{props.children}</DataContext.Provider>
      </InternalContext.Provider>
    );
  }

  return BroswerDataContext;
};

const wait = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ error: "timeout" });
    }, time);
  });
};

export const createServerContext = () => {
  let ctx: IDataContext = {};
  let internalContextValue: IInternalContext = { resolved: false, requests: [] };

  function ServerDataContext<T extends { children: React.ReactNode }>(props: T) {
    return (
      <InternalContext.Provider value={internalContextValue}>
        <DataContext.Provider value={ctx}>{props.children}</DataContext.Provider>
      </InternalContext.Provider>
    );
  }

  const resolveData = async (context: RequestContext, timeout?: number) => {
    const effects = internalContextValue.requests.map((item) => item.promise(context));

    if (timeout) {
      const timeOutPr = wait(timeout);

      await Promise.all(
        internalContextValue.requests.map((effect, index) => {
          return Promise.race([effect.promise(context), timeOutPr]).catch(() => {
            return effect.cancel();
          });
        })
      );
    } else {
      await Promise.all(effects);
    }

    internalContextValue.resolved = true;
    return ctx;
  };

  return { ServerDataContext, resolveData };
};

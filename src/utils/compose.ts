import { ComposeCallback } from "./types";

export const compose = <T>(...funcs: ComposeCallback<T>[]): ComposeCallback<T> => (arg: T): T => (
  funcs.reduce((acc: T, currFunc: ComposeCallback<T>) => currFunc(acc), arg)
);
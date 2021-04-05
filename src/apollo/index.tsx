import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { elementsVar } from "../ReactiveVariables/state";
import { cookies } from "../Cookie/state";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Plain
          items: {
            read(cached) {
              return cached ?? [];
            },
          },

          // Local Starge
          todos: {
            read() {
              return JSON.parse(window.localStorage.getItem("TODOS") ?? "[]");
            },
          },

          // ReactiveVars
          elements: {
            read() {
              return elementsVar();
            },
          },

          // Cookie
          lines: {
            read(cached) {
              return cached ?? cookies.get("LINES") ?? [];
            },
          },
        },
      },
    },
  }),
});

export const Provider: React.FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

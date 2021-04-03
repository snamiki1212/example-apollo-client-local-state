import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { elementsVar } from "../ReactiveVariables/state";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          items: {
            read(cached) {
              return cached ?? [];
            },
          },
          todos: {
            read() {
              return JSON.parse(window.localStorage.getItem("TODOS") ?? "[]");
            },
          },
          elements: {
            read() {
              return elementsVar();
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

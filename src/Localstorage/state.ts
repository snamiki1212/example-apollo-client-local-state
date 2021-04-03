import { gql } from "@apollo/client";

export const Noop = gql`
  mutation Noop {
    items @client
  }
`;

export const GetTodos = gql`
  query GetTodos {
    todos @client
  }
`;

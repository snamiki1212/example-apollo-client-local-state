import { gql } from "@apollo/client";

export const GetItems = gql`
  query GetItems {
    items @client
  }
`;

export const Noop = gql`
  mutation Noop {
    items @client
  }
`;

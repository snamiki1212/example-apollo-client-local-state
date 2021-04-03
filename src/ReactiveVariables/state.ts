import { gql, makeVar } from "@apollo/client";

export const Noop = gql`
  mutation Noop {
    items @client
  }
`;

export const GetElements = gql`
  query GetElements {
    elements @client
  }
`;

export const elementsVar = makeVar([] as string[]);

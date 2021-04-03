import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useMutation,
  gql,
} from "@apollo/client";
// import {} from '@apollo/client/link'

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          items: {
            read(cached) {
              return cached ?? [];
            },
          },
        },
      },
    },
  }),
});

const Provider: React.FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

function App() {
  return (
    <Provider>
      <div>ok</div>
      <Items />
      <Handler />
    </Provider>
  );
}

const GetItems = gql`
  query GetItems {
    items @client
  }
`;

const Noop = gql`
  mutation Noop {
    items @client
  }
`;

const Handler = () => {
  const [noop] = useMutation(Noop, {
    update(cache) {
      const prevData = cache.readQuery({
        query: GetItems,
      });
      const prev = (prevData as any)?.items;

      const result = cache.writeQuery({
        query: GetItems,
        data: { items: [...prev, "new"] },
      });

      console.log("UPDATE:", result);
    },
  });

  const handleAdd = async () => {
    const result = await noop();
    console.log("ok", result);
  };
  return (
    <div>
      <button onClick={handleAdd}>+</button>
    </div>
  );
};

const Items = () => {
  const { data, loading, error } = useQuery(GetItems);
  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!data) return <div>no data</div>;
  const items = data?.items;
  console.log("ITEMS, ", items);
  if (!Array.isArray(items)) return <div>loading</div>;

  return (
    <div>
      <h3>This is Items</h3>
      {items?.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export default App;

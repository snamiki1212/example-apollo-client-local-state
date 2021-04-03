import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useMutation,
  gql,
} from "@apollo/client";

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
          todos: {
            read() {
              return JSON.parse(window.localStorage.getItem("TODOS") ?? "[]");
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
      <div>
        <h3>InMemoryCache</h3>
        <HandleItems />
        <ShowItems />
        <ClearItems />
      </div>

      <div>
        <h3>LocalStorage</h3>
        <HandleTodos />
        <ShowTodos />
        <ClearTodos />
      </div>
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

const GetTodos = gql`
  query GetTodos {
    todos @client
  }
`;

const HandleItems = () => {
  const [text, setText] = React.useState<string>("");
  const [noop] = useMutation(Noop, {
    update(cache) {
      const prevData = cache.readQuery({
        query: GetItems,
      });
      const prev = (prevData as any)?.items;

      const result = cache.writeQuery({
        query: GetItems,
        data: { items: [...prev, text] },
      });

      console.log("UPDATE:", result);
    },
  });

  const handleAdd = async () => {
    await noop();
  };

  return (
    <div>
      <input onChange={(e) => setText(e.target.value)} value={text} />
      <button onClick={handleAdd}>+</button>
    </div>
  );
};

const ShowItems = () => {
  const { data, loading, error } = useQuery(GetItems);
  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!data || !data.items) return <div>no data</div>;

  const items: Array<string> = data.items;

  return (
    <div>
      {items?.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

const ClearItems = () => {
  const clear = () => {
    client.writeQuery({
      query: GetItems,
      data: { items: [] },
    });
  };
  return <button onClick={clear}>clear</button>;
};

const HandleTodos = () => {
  const [text, setText] = React.useState<string>("");
  const [noop] = useMutation(Noop, {
    update(cache) {
      const prevData = cache.readQuery({
        query: GetTodos,
      });
      const prev = (prevData as any)?.todos;

      const newData = [...prev, text];

      const result = cache.writeQuery({
        query: GetTodos,
        data: { todos: newData },
      });

      window.localStorage.setItem("TODOS", JSON.stringify(newData));

      console.log("UPDATE:", result);
    },
  });

  const handleAdd = async () => {
    await noop();
  };

  return (
    <div>
      <input onChange={(e) => setText(e.target.value)} value={text} />
      <button onClick={handleAdd}>+</button>
    </div>
  );
};

const ShowTodos = () => {
  const { data, loading, error } = useQuery(GetTodos);
  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!data || !data.todos) return <div>no data</div>;

  const todos: Array<string> = data.todos;

  return (
    <div>
      {todos?.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

const ClearTodos = () => {
  const clear = () => {
    window.localStorage.clear();
    client.writeQuery({
      query: GetTodos,
      data: { todos: [] },
    });
  };

  return <button onClick={clear}>Clear</button>;
};

export default App;

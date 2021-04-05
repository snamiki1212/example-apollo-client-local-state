import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Noop, GetTodos } from "./state";
import { client } from "../apollo";

export const HandleTodos = () => {
  const [text, setText] = React.useState<string>("");
  const [noop] = useMutation(Noop, {
    update(cache) {
      const prevData = cache.readQuery({
        query: GetTodos,
      });
      const prev = (prevData as any)?.todos;

      const newData = [...prev, text];

      cache.writeQuery({
        query: GetTodos,
        data: { todos: newData },
      });

      window.localStorage.setItem("TODOS", JSON.stringify(newData));
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

export const ShowTodos = () => {
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

export const ClearTodos = () => {
  const clear = () => {
    window.localStorage.clear();
    client.writeQuery({
      query: GetTodos,
      data: { todos: [] },
    });
  };

  return <button onClick={clear}>Clear</button>;
};

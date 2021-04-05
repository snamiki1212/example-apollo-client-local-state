import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Noop, GetItems } from "./state";
import { client } from "../apollo";

export const HandleItems = () => {
  const [text, setText] = React.useState<string>("");
  const [noop] = useMutation(Noop, {
    update(cache) {
      const prevData = cache.readQuery({
        query: GetItems,
      });
      const prev = (prevData as any)?.items;
      const newData = [...prev, text];

      cache.writeQuery({
        query: GetItems,
        data: { items: newData },
      });
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

export const ShowItems = () => {
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

export const ClearItems = () => {
  const clear = () => {
    client.writeQuery({
      query: GetItems,
      data: { items: [] },
    });
  };
  return <button onClick={clear}>clear</button>;
};

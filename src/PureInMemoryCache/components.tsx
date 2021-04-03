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

      const result = cache.writeQuery({
        query: GetItems,
        data: { items: newData },
      });

      console.log("UPDATE:", result);
      console.log("new Items", newData);
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
  console.log("ITEMS", items);

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

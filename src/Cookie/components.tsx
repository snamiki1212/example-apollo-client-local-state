import React from "react";
import { cookies } from "./state";
import { useQuery, useMutation, gql } from "@apollo/client";
import { client } from "../apollo";

const GetLines = gql`
  query GetLines {
    lines @client
  }
`;
const Noop = gql`
  mutation Noop {
    lines @client
  }
`;

export const ShowLines = () => {
  const { data, loading, error } = useQuery(GetLines);

  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!data || !data.lines) return <div>no data</div>;

  const lines: Array<string> = data.lines;

  return (
    <div>
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
};

export const HandleLines = () => {
  const [text, setText] = React.useState<string>("");
  const [noop] = useMutation(Noop, {
    update(cache) {
      const prevData = cache.readQuery({
        query: GetLines,
      });
      const prev = (prevData as any)?.lines;
      const newData = [...prev, text];

      cache.writeQuery({
        query: GetLines,
        data: { lines: newData },
      });

      cookies.set("LINES", newData);
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

export const ClearLines = () => {
  const clear = () => {
    client.writeQuery({
      query: GetLines,
      data: { lines: [] },
    });

    cookies.remove("LINES");
  };
  return <button onClick={clear}>clear</button>;
};

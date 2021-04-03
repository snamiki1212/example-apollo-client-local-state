import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GetElements, Noop, elementsVar } from "./state";

export const ShowElements = () => {
  const { data, loading, error } = useQuery(GetElements);
  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!data || !data.elements) return <div>no data</div>;

  const elements: Array<string> = data.elements;
  console.log("DATA, data", data);

  return (
    <div>
      {elements?.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export const HandleElements = () => {
  const [text, setText] = React.useState<string>("");
  const [noop] = useMutation(Noop, {
    update() {
      const result = elementsVar([...elementsVar(), text]);
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

export const ClearElements = () => {
  return <button onClick={() => elementsVar([])}>clear</button>;
};

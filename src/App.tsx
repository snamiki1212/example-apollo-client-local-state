import React from "react";
import {
  ShowElements,
  ClearElements,
  HandleElements,
} from "./ReactiveVariables/components";
import { ShowTodos, ClearTodos, HandleTodos } from "./Localstorage/components";
import {
  ShowItems,
  ClearItems,
  HandleItems,
} from "./PureInMemoryCache/components";
import { Provider } from "./apollo";

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

      <div>
        <h3>Reactive Variables</h3>
        <HandleElements />
        <ShowElements />
        <ClearElements />
      </div>
    </Provider>
  );
}

export default App;

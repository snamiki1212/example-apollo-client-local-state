import React from "react";
import { Provider } from "./apollo";
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
import { ShowLines, ClearLines, HandleLines } from "./Cookie/components";

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

      <div>
        <h3>Cookie</h3>
        <HandleLines />
        <ShowLines />
        <ClearLines />
      </div>
    </Provider>
  );
}

export default App;

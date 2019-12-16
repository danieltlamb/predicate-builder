import React from "react";
import "./App.css";
import PredicateBuilder from "./components/PredicateBuilder";

const App = () => {
  return (
    <div className="App">
      <div className="App-body">
        <div id="menu-portal" />
        <PredicateBuilder />
      </div>
    </div>
  );
};

export default App;

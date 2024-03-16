import React from "react";
import logo from "./logo.svg";

import "./App.css";
import Schedules from "./components/Schedules";

function App() {
  return (
    <div className="App">
      <div className="header"></div>
      <div className="container-fluid">
        <div className="row"></div>
        <div className="row">
          <div className="col-auto col-sm-1" id="sideNav"></div>
          <div className="col-auto col-sm-11" id="topNav"></div>
        </div>
      </div>
      <div className="container">
        <Schedules></Schedules>
      </div>
    </div>
  );
}

export default App;

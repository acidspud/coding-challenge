import React from "react";
import Sping from "../assets/images/spin.gif";

function Loading() {
  return (
    <div className="loading-container">
      <img alt="loading" src={Sping} />
    </div>
  );
}

export default Loading;

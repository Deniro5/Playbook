import React from "react";
import { Link } from "react-router-dom";

const Error: React.FC = () => {
  return (
    <div>
      <h1> The page that you are looking for could not be found </h1>
      <h4>
        Click <Link to='/'> here</Link> to return home
      </h4>
    </div>
  );
};

export default Error;

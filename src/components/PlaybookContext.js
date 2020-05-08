import React, { useState, createContext } from "react";
export const PlaybookContext = createContext();
export const PlaybookProvider = (props) => {
  const [playbook, setPlaybook] = useState({});
  const [playbookIndex, setPlaybookIndex] = useState(-1);
  return (
    <PlaybookContext.Provider
      value={[playbook, setPlaybook, playbookIndex, setPlaybookIndex]}>
      {props.children}
    </PlaybookContext.Provider>
  );
};

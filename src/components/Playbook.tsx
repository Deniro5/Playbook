import React from "react";
import { Link } from "react-router-dom";

export interface IPlaybookProps {
  id: string;
  name: string;
  desc: string;
  date: string;
  formations: Object[];
  playCount: number;
  setPlaybooks: React.Dispatch<React.SetStateAction<never[]>>;
  index: number;
}

const Playbook: React.FC<IPlaybookProps> = (props) => {
  const { id, name, desc, date, formations, playCount, index } = props;

  const deletePlaybook = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    let choice = window.confirm("Are you sure you want to delete this playbook?");
    if (choice) {
      let playbooks = JSON.parse(localStorage.getItem("playbooks")!);
      playbooks.splice(index, 1);
      props.setPlaybooks(playbooks);
      localStorage.setItem("playbooks", JSON.stringify(playbooks));
      alert("Playbook deleted");
    }
    e.preventDefault();
  };

  return (
    <Link style={{ textDecoration: "none" }} to={{ pathname: `/${id}` }}>
      <div id='playbookContainer'>
        <p onClick={(e) => deletePlaybook(e)} id='deletePlaybook'>
          x
        </p>
        <h1 id='playbookTitle'> {name} </h1>
        <p className='playbookSubTitle'> Formations: {formations.length} </p>
        <p className='playbookSubTitle'> Plays: {playCount} </p>
        <p id='playbookSummary'>{desc}</p>
        <p id='playbookDate'>{`Created on ${date}`}</p>
      </div>
    </Link>
  );
};

export { Playbook };

import React, { useState, useEffect } from "react";
import { Playbook } from "./Playbook";
import { NewPlaybook } from "./NewPlaybook";
import Modal from "@material-ui/core/Modal";
import defaultPlaybook from "./defaultPlaybooks";

export interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [playbooks, setPlaybooks] = useState([]);

  useEffect(() => {
    //Load playbooks if they exist
    if (localStorage.getItem("playbooks") !== null) {
      let playbooks = JSON.parse(localStorage.getItem("playbooks")!);
      setPlaybooks(playbooks);
    } else {
      localStorage.setItem("playbooks", JSON.stringify(defaultPlaybook));
      localStorage.setItem("currId", "1");
      setPlaybooks(defaultPlaybook);
    }
  }, []);

  const getPlayCount = (playbook: any) => {
    //Takes a playbooks formation array and counts the number of plays
    let totalPlays = 0;
    let formations = playbook.formations;
    if (formations.length > 0) {
      formations.forEach((formation: any) => {
        totalPlays += formation.plays.length;
      });
    }
    return totalPlays;
  };

  return (
    <div>
      <h1 className='title'> Saved Playbooks </h1>
      <div className='border' />
      <h4 className='subTitle'>
        Select an existing playbook to get started or create a new one
      </h4>
      {playbooks.map((playbook, index) => (
        <Playbook
          {...playbook}
          playCount={getPlayCount(playbook)}
          setPlaybooks={setPlaybooks}
          index={index}
        />
      ))}
      {playbooks.length === 0 && (
        <p style={{ marginTop: "50px", marginBottom: "40px" }}> No Playbooks Saved </p>
      )}
      <button
        onClick={() => {
          setModalOpen(true);
        }}
        id='newPlaybook'>
        Create New Playbook
      </button>
      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}>
        <NewPlaybook setPlaybooks={setPlaybooks} close={setModalOpen} />
      </Modal>
    </div>
  );
};

export { Home };

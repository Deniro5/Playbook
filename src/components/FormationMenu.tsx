import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { NewFormation } from "./NewFormation";

export interface IFormationMenuProps {
  formations: any;
  setCurrFormation: React.Dispatch<React.SetStateAction<number>>;
  setCurrPlay: React.Dispatch<React.SetStateAction<number>>;
}

const FormationMenu: React.FC<IFormationMenuProps> = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { formations } = props;

  return (
    <div id='formationMenuContainer'>
      <h4 id='formationMenuTitle'> Formations </h4>
      {formations.map((formation: any, index: number) => (
        <div
          className='formationMenuItem'
          onClick={() => {
            props.setCurrFormation(index);
            props.setCurrPlay(-1);
          }}>
          {formation.name}
        </div>
      ))}
      {formations.length === 0 && <p> No Formations Saved </p>}
      <button onClick={() => setModalOpen(true)} id='newFormation'>
        Create New Formation
      </button>
      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={modalOpen}
        onClose={() => setModalOpen(false)}>
        <NewFormation close={setModalOpen} />
      </Modal>
    </div>
  );
};

export default FormationMenu;

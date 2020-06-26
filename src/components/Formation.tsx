import React, { useState, useEffect, useContext, Fragment } from "react";
import FormationMenu from "./FormationMenu";
import { DisplayPlay } from "./DisplayPlay";
import { PlayPreview } from "./PlayPreview";
import AddCircle from "@material-ui/icons/AddCircleOutline";
import { NewPlay } from "./NewPlay";
import Modal from "@material-ui/core/Modal";
import { useParams } from "react-router";
import { PlaybookContext } from "./PlaybookContext";
import Error from "./Error";
export interface IFormationProps {}

const Formation: React.FC<IFormationProps> = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currFormation, setCurrFormation] = useState(0);
  const [currPlay, setCurrPlay] = useState(-1);
  const [valid, setValid] = useState(false);
  const { playbookid } = useParams();
  const [playbook, setPlaybook, playbookIndex, setPlaybookIndex] = useContext(
    PlaybookContext
  );

  useEffect(() => {
    //Load the current playbook
    const playbooks = JSON.parse(localStorage.getItem("playbooks")!);
    let index = 0;
    let newValid = false;
    for (let playbook of playbooks) {
      if (playbook.id === playbookid) {
        newValid = true;
        break;
      }
      index++;
    }
    setValid(newValid);
    setPlaybook(playbooks[index]);
    setPlaybookIndex(index);
    setLoaded(true);
    setCurrFormation(0);
  }, [playbookid]);

  const deleteFormation = () => {
    let choice = window.confirm("Are you sure you want to delete this formation?");
    if (choice) {
      let newPlaybook = { ...playbook };
      let newFormations = playbook.formations;
      newFormations.splice(currFormation, 1);
      newPlaybook.formations = newFormations;
      setPlaybook(newPlaybook);
      let playbooks = JSON.parse(localStorage.getItem("playbooks")!);
      playbooks[playbookIndex] = newPlaybook;
      localStorage.setItem("playbooks", JSON.stringify(playbooks));
      alert("Formation deleted");
      setCurrFormation(0);
    } else {
    }
  };

  if (loaded) {
    //check if we should be displaying a play or the play previews
    let mainContent = [];
    if (currPlay > -1) {
      mainContent.push(
        <DisplayPlay
          setCurrPlay={setCurrPlay}
          currPlay={currPlay}
          currFormation={currFormation}
          positions={playbook.formations[currFormation].positions}
          {...playbook.formations[currFormation].plays[currPlay]}
        />
      );
    } else if (!valid) {
      return <Error />;
    } else {
      mainContent.push(
        <Fragment>
          {playbook.formations.length > currFormation && (
            <Fragment>
              <h1 id='formationName'>
                Formation: {playbook.formations[currFormation].name}
              </h1>
              <div id='formationBorder' />
              <h4 className='subTitle'> Click on a play to view or add a new play </h4>
              <AddCircle id='uploadIcon' onClick={() => setModalOpen(true)} />
              {playbook.formations[currFormation].plays.map(
                (play: any, index: number) => (
                  <PlayPreview
                    {...play}
                    positions={playbook.formations[currFormation].positions}
                    setCurrPlay={setCurrPlay}
                    index={index}
                  />
                )
              )}
              <button
                id='deleteButton'
                onClick={deleteFormation}
                style={{ display: "block", margin: "auto", marginTop: "50px" }}
                className='backButton'>
                Delete Formation
              </button>
              <Modal
                aria-labelledby='simple-modal-title'
                aria-describedby='simple-modal-description'
                open={modalOpen}
                onClose={() => setModalOpen(false)}>
                <NewPlay
                  positions={playbook.formations[currFormation].positions}
                  close={setModalOpen}
                  currFormation={currFormation}
                />
              </Modal>
            </Fragment>
          )}
          {playbook.formations.length <= currFormation && <p> No Formation Selected </p>}
        </Fragment>
      );
    }

    return (
      <div>
        <FormationMenu
          setCurrFormation={setCurrFormation}
          setCurrPlay={setCurrPlay}
          formations={playbook.formations}
        />
        <div style={{ marginLeft: "250px" }}>
          <div id='formationContainer'>{mainContent}</div>
        </div>
      </div>
    );
  } else {
    return <div> Loading </div>;
  }
};

export { Formation };

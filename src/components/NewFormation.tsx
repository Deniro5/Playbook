import React, { useState, ChangeEvent, useRef, useEffect, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { PlaybookContext } from "./PlaybookContext";
import Grid from "@material-ui/core/Grid";
import getStorage from "./getstorage";

export interface INewFormationProps {
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewFormation: React.FC<INewFormationProps> = (props) => {
  const [playbook, setPlaybook, playbookIndex] = useContext(PlaybookContext);
  const [name, setName] = useState("");
  const [positions, setPositions] = useState([
    [40, 225],
    [115, 225],
    [190, 225],
    [265, 225],
    [155, 275],
  ]);
  const [mousePressed, setMousePressed] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    updateCanvas();
  }, [positions]);

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.length <= 40) {
      setName(event.target.value);
    }
  };

  const updateCanvas = () => {
    if (canvas !== null && canvas.current !== null) {
      const ctx = canvas.current.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      for (let pos of positions) {
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI, false);
        ctx.fill();
      }
    }
  };

  const drag = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (mousePressed && canvas && canvas.current) {
      const recta = canvas.current.getBoundingClientRect();
      const cx = event.clientX - recta.left - 10; //x position within the element.
      const cy = event.clientY - recta.top - 10; //y position within the element.
      let index = 0;
      for (let pos of positions) {
        if (
          pos[0] - 10 <= cx &&
          cx <= pos[0] + 10 &&
          pos[1] - 10 <= cy &&
          cy <= pos[1] + 10
        ) {
          let newPositions = [...positions];
          newPositions[index] = [cx + 7 + event.movementX, cy + 7 + event.movementY];
          setPositions(newPositions);
        }
        index++;
      }
    }
  };

  const submit = () => {
    if (name.length > 0) {
      const newFormation = { name: name, positions: positions, plays: [] };
      const currStorage = getStorage();
      const newFormationSize = (JSON.stringify(newFormation).length * 2) / 1000;
      if (currStorage + newFormationSize < 5120) {
        let newPlaybook = { ...playbook };
        newPlaybook.formations = [...newPlaybook.formations, newFormation];
        setPlaybook(newPlaybook);
        let playbooks = JSON.parse(localStorage.getItem("playbooks")!);
        playbooks[playbookIndex] = newPlaybook;
        localStorage.setItem("playbooks", JSON.stringify(playbooks));
        alert("Formation Successfully Created");
        props.close(false);
      } else {
        alert("Not enough space available");
      }
    } else {
      alert("Please enter a name for the new formation.");
    }
  };

  return (
    <div className='createContainer' onMouseUp={() => setMousePressed(false)}>
      <h1 id='createTitle'> Create New Formation</h1>
      <div className='border'> </div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <canvas
            onMouseDown={() => setMousePressed(true)}
            onMouseUp={() => setMousePressed(false)}
            className='canvas'
            ref={canvas}
            onMouseMoveCapture={(e) => drag(e)}
            width={300}
            height={300}></canvas>
        </Grid>
        <Grid item xs={12} md={5}>
          <div className='createInputContainer'>
            <h4 className='createInstruction'>
              Please provide a name (max 40 Characters) for the new formation. Customize
              the formation by moving the 5 players into the desired position.
            </h4>
            <TextField
              onChange={handleNameChange}
              value={name}
              label='Name'
              className='input'
              variant='outlined'
              required
            />
            <button className='submitButton' onClick={submit}>
              Submit
            </button>
            <button className='cancelButton' onClick={() => props.close(false)}>
              Cancel
            </button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export { NewFormation };

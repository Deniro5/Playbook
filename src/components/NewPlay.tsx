import React, { useState, ChangeEvent, useRef, useEffect, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { PlaybookContext } from "./PlaybookContext";
import Grid from "@material-ui/core/Grid";
import getStorage from "./getstorage";

export interface INewPlayProps {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  positions: number[][];
  currFormation: number;
}

const NewPlay: React.FC<INewPlayProps> = (props) => {
  const [playbook, setPlaybook, playbookIndex] = useContext(PlaybookContext);
  const { positions, currFormation } = props;
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [points, setPoints] = useState<number[][][]>([]);
  const [currPoints, setCurrPoints] = useState<number[][]>([]);
  const [mousePressed, setMousePressed] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    updateCanvas();
  }, [points, currPoints]);

  useEffect(() => {
    if (!mousePressed && currPoints.length > 0) {
      let newPoints = [...points, currPoints];
      setPoints(newPoints);
      setCurrPoints([]);
    }
  }, [mousePressed]);

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.length <= 40) {
      setName(event.target.value);
    }
  };

  const handleDescChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.length <= 250) {
      setDesc(event.target.value);
    }
  };

  const updateCanvas = () => {
    if (canvas !== null && canvas.current !== null) {
      const ctx = canvas.current.getContext("2d")!;
      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
      ctx.fillStyle = "#000000";
      for (let pos of positions) {
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI, false);
        ctx.fill();
      }
      //want to iterate through all the points even the ones currently being drawn
      let allPoints = [...points, currPoints];
      for (let pointArr of allPoints) {
        for (let point of pointArr) {
          rect({ ctx, x: point[0], y: point[1], width: 3, height: 3 });
        }
      }
    }
  };
  function rect(props: any) {
    const { ctx, x, y, width, height } = props;
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(x, y, width, height);
  }

  const draw = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (mousePressed && canvas && canvas.current) {
      const recta = canvas.current.getBoundingClientRect();
      const cx = event.clientX - recta.left - 5; //x position within the element.
      const cy = event.clientY - recta.top - 5; //y position within the element.
      let newPoints: number[][] = [];
      newPoints.push([cx, cy]);
      setCurrPoints([...currPoints, ...newPoints]);
    }
  };

  const undo = () => {
    let newPoints = [...points];
    newPoints.pop();
    setPoints(newPoints);
  };

  const clear = () => {
    setPoints([]);
  };

  const submit = () => {
    if (name.length > 0 && desc.length > 0) {
      let allPoints = [];
      for (let pointArr of points) {
        for (let point of pointArr) {
          //round to minimize space
          allPoints.push([
            Math.round(point[0] * 10) / 10,
            Math.round(point[1] * 10) / 10,
          ]);
        }
      }
      const newPlay = { name: name, desc: desc, points: allPoints };
      const newPlaySize = (JSON.stringify(newPlay).length * 2) / 1000;
      const currStorage = getStorage();
      if (currStorage + newPlaySize < 5120) {
        //check if we have storage space
        let newPlaybook = { ...playbook };
        let newFormation = playbook.formations[currFormation];
        newFormation.plays = [...newFormation.plays, newPlay];
        newPlaybook.formations[currFormation] = newFormation;
        let playbooks = JSON.parse(localStorage.getItem("playbooks")!);
        playbooks[playbookIndex] = newPlaybook;
        localStorage.setItem("playbooks", JSON.stringify(playbooks));
        setPlaybook(newPlaybook);
        alert("Play Successfully Created");
        props.close(false);
      } else {
        alert("Not enough space available");
      }
    } else {
      alert("Please enter a name and a description for the new play");
    }
  };

  return (
    <div className='createContainer' onMouseUp={() => setMousePressed(false)}>
      <h1 id='createTitle'> Create New Play</h1>
      <div className='border'> </div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <button className='newPlayControls' onClick={() => undo()}>
            Undo
          </button>
          <button className='newPlayControls' onClick={() => clear()}>
            Clear
          </button>
          <canvas
            onMouseDown={() => setMousePressed(true)}
            onMouseUp={() => setMousePressed(false)}
            className='canvas'
            ref={canvas}
            onMouseMoveCapture={(e) => draw(e)}
            width={300}
            height={300}></canvas>
        </Grid>
        <Grid item xs={12} md={5} style={{ textAlign: "center" }}>
          <div className='createInputContainer'>
            <h4 className='createInstruction'>
              Please fill provide a name (max 40 Characters) and a description (max 250
              characters) for the play.
            </h4>
            <div className='inputContainer'>
              <TextField
                onChange={handleNameChange}
                value={name}
                label='Name'
                className='input'
                variant='outlined'
                required
              />
              <TextField
                onChange={handleDescChange}
                value={desc}
                label='Description'
                multiline={true}
                rows={8}
                className='input'
                variant='outlined'
                required
              />
            </div>
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

export { NewPlay };

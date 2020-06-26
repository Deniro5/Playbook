import React, { useRef, useEffect, useContext } from "react";
import { PlaybookContext } from "./PlaybookContext";
import Grid from "@material-ui/core/Grid";

export interface IDisplayPlayProps {
  positions: number[][];
  points: number[][];
  name: string;
  desc: string;
  currFormation: number;
  currPlay: number;
  setCurrPlay: React.Dispatch<React.SetStateAction<number>>;
}

const DisplayPlay: React.FC<IDisplayPlayProps> = (props) => {
  const [playbook, setPlaybook, playbookIndex] = useContext(PlaybookContext);
  const { positions, points, name, desc, currFormation, currPlay } = props;
  const canvas = useRef<HTMLCanvasElement>(null);

  function rect(props: any) {
    const { ctx, x, y, width, height } = props;
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(x, y, width, height);
  }

  useEffect(() => {
    if (canvas !== null && canvas.current !== null) {
      const ctx = canvas.current.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      for (let point of points) {
        rect({ ctx, x: point[0], y: point[1], width: 3, height: 3 });
      }
      ctx.fillStyle = "#000000";
      for (let pos of positions) {
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI, false);
        ctx.fill();
      }
    }
  }, [props]);

  const deletePlay = () => {
    let choice = window.confirm("Are you sure you want to delete this play?");
    if (choice) {
      let newPlaybook = { ...playbook };
      let newFormation = playbook.formations[currFormation];
      newFormation.plays.splice(currPlay, 1);
      newPlaybook.formations[currFormation] = newFormation;
      setPlaybook(newPlaybook);
      let playbooks = JSON.parse(localStorage.getItem("playbooks")!);
      playbooks[playbookIndex] = newPlaybook;
      localStorage.setItem("playbooks", JSON.stringify(playbooks));
      alert("Play deleted");
      props.setCurrPlay(-1);
    } else {
    }
  };

  return (
    <div className='displayContainer'>
      <h1 id='createTitle'> {name}</h1>
      <div className='border'> </div>
      <Grid container spacing={3}>
        <Grid item sm={12} md={6}>
          <canvas
            style={{
              display: "block",
              background: "green",
              border: "1px solid black",
              position: "relative",
              margin: "auto",
              marginTop: "30px",
            }}
            ref={canvas}
            width={300}
            height={300}></canvas>
        </Grid>
        <Grid item sm={12} md={6} style={{ textAlign: "center" }}>
          <h2 style={{ marginTop: "30px" }}> Description: </h2>
          <p id='playDesc'> {desc} </p>
        </Grid>
      </Grid>
      <div style={{ marginTop: "25px" }}>
        <button onClick={() => props.setCurrPlay(-1)} className='backButton'>
          Back to Formation
        </button>
        <button id='deleteButton' onClick={deletePlay} className='backButton'>
          Delete Play
        </button>
      </div>
    </div>
  );
};

export { DisplayPlay };

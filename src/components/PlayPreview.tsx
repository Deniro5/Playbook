import React, { Fragment, useRef, useEffect } from "react";

export interface IPlayPreviewProps {
  name: string;
  desc: string;
  points: number[][];
  positions: number[][];
  index: number;
  setCurrPlay: React.Dispatch<React.SetStateAction<number>>;
}

const PlayPreview: React.FC<IPlayPreviewProps> = (props) => {
  const { name, points, positions, index } = props;
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
  return (
    <Fragment>
      <div id='playPreviewContainer'>
        <canvas
          onClick={() => props.setCurrPlay(index)}
          style={{
            display: "inline-block",
            background: "green",
            position: "relative",
            margin: "auto",
            cursor: "pointer",
          }}
          ref={canvas}
          width={300}
          height={300}></canvas>
        <h1 id='playPreviewName'> {name} </h1>
      </div>
    </Fragment>
  );
};

export { PlayPreview };

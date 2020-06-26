import React, { useState, ChangeEvent } from "react";
import TextField from "@material-ui/core/TextField";
import getStorage from "./getstorage";

export interface INewPlaybookProps {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaybooks: React.Dispatch<React.SetStateAction<any>>;
}

const NewPlaybook: React.FC<INewPlaybookProps> = (props) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

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

  const submit = () => {
    if (name.length > 0 && desc.length > 0) {
      const today = new Date();
      let strDate = today.toString().substring(4, 15);
      let playbooks = JSON.parse(localStorage.getItem("playbooks")!);
      const newPlaybook = {
        id: localStorage.getItem("currId"),
        name: name,
        desc: desc,
        date: strDate,
        formations: [],
      };
      const currStorage = getStorage();
      const newPlaybookSize = (JSON.stringify(newPlaybook).length * 2) / 1000;
      if (currStorage + newPlaybookSize < 5120) {
        playbooks.unshift(newPlaybook);
        props.setPlaybooks(playbooks);
        localStorage.setItem("playbooks", JSON.stringify(playbooks));
        const nextId = Number(localStorage.getItem("currId")) + 1;
        localStorage.setItem("currId", nextId.toString());
        props.close(false);
        alert("Playbook successfully created");
      } else {
        alert("Not enough space available");
      }
    } else {
      alert("Please enter a name and a description for the new playbook");
    }
  };

  return (
    <div className='createContainer'>
      <h1 className='title'> Create New Playbook</h1>
      <div className='border'> </div>
      <h4 className='subTitle'>
        Please fill provide a name (max 40 Characters) and a description (max 250
        characters) for the playbook.
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
  );
};

export { NewPlaybook };

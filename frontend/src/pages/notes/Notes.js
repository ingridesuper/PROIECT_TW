import React, { useEffect, useState } from "react";
import NoteList from "../../components/NoteList"; 
import { Link } from "react-router-dom"; 
import './Notes.css';

export default function Notes({user}) {


    
    

  return (
    <>
    <Link to="./new">
    <button className="fab">+</button>
    </Link>
    
    <div className="notes-container">
      <NoteList user={user} />
    </div>
    </>
  );
}

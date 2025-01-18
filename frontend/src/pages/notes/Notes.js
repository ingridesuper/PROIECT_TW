import React from "react";
import NoteList from "../../components/NoteList"; 

import './Notes.css'; // Stiluri pentru componenta Notes


export default function Notes() {
    const loremIpsum="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
  // hardocdat deocmadata
  const notes = [
    { id: 1, title: "Butoane", content:loremIpsum },
    { id: 2, title: "Event Handlers", content: loremIpsum },
    { id: 3, title: "CSS", content: loremIpsum },
    { id: 4, title: "Flexbox", content: loremIpsum},
    { id: 5, title: "Histograme", content: loremIpsum},
    { id: 6, title: "ACP", content: loremIpsum},
    { id: 7, title: "Use-Case", content: loremIpsum}
  ];

  return (
    <div className="notes-container">
      
      <NoteList notes={notes} />
    </div>
  );
}

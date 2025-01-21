import {Routes, Route, Link} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Notes from './pages/notes/Notes';
import NewNote from './pages/notes/NewNote';
import EditNote from './pages/notes/EditNote';
import NotFound from './pages/NotFound';
import StudyGroups from './pages/studygroups/StudyGroups';
import Subjects from './pages/subject/Subjects';
import EnrollSubject from "./pages/subject/EnrollSubject";
import Colegi from "./pages/colegi/Colegi";
import "./styles/styles.css"
import penIcon from "./media/pen.svg"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]=useState(null);

  useEffect(() => {
    fetch('/api/auth/status', {
      method: 'GET',
      credentials: 'include', // pentru a trimite cookies cu cererea
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(data.user); // salvam utilizatorul
          console.log(data.user) 

        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error('Eroare la verificarea autentificării:', error);
      });
  }, []);

  return (
    <>
      <div id="logoContainer">
        <img id="penIcon" src={penIcon} alt="Pen icon" />
        <h4 id="numeAplicatie">StudyNotes</h4>
      </div>

      <div>
        <nav>
          <ul>
            <li><Link to="/">home</Link></li>
            <li><Link to="/notes">notițe</Link></li>
            <li><Link to="/studygroups">study groups</Link></li>
            <li><Link to="/subjects">materii</Link></li>
            <li><Link to="/colegi">colegi</Link></li>
          </ul>
        </nav>
      </div>


      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />}></Route>
        <Route path="/notes" element={ isAuthenticated ? <Notes user={user}/> : <Home></Home>} />
        <Route path="/notes/new" element={isAuthenticated ? <NewNote user={user}/> : <Home></Home>}></Route>
        <Route path="/notes/:noteId" element={isAuthenticated ? <EditNote user={user}/> : <Home></Home>}></Route>

        <Route path="/studygroups" element={isAuthenticated ? <StudyGroups user={user}/> : <Home></Home>}></Route>

        <Route path="/subjects" element={isAuthenticated ? <Subjects user={user}/> : <Home></Home>}></Route>
        <Route path="/subjects/enroll" element={isAuthenticated ? <EnrollSubject user={user}/> : <Home></Home>}></Route>

        <Route path="/colegi" element={isAuthenticated ? <Colegi user={user}/> : <Home/>}></Route>

        <Route path="/studygroups" element={isAuthenticated ? <StudyGroups user={user}/> : <Home/>}></Route>


        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </>
  );
}

export default App;

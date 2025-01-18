import logo from './logo.svg';
import './App.css';
import {Routes, Route, Link} from "react-router-dom";
import Home from './pages/Home';
import Notes from './pages/notes/Notes';
import NewNote from './pages/notes/NewNote';
import EditNote from './pages/notes/EditNote';
import NotFound from './pages/NotFound';
import StudyGroups from './pages/StudyGroups';
import Subjects from './pages/Subjects';
import "./styles/styles.css"
import penIcon from "./media/pen.svg"

function App() {
  return (
    <div className="App">

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
            <li><Link to="/lalala">colegi</Link></li>
          </ul>
        </nav>
      </div>


      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/notes" element={<Notes></Notes>}></Route>
        <Route path="/notes/new" element={<NewNote></NewNote>}></Route>

        {/* id care poate fi folosit -> edit */}
        {/* asta e var 1 - route params; 
        (var 2 - outlet si context) 
        var 3 - parameters cu state? idk vezi la notes*/}
        {/* putem trimite cate routes parameters vrem */}
        <Route path="/notes/:id" element={<EditNote></EditNote>}></Route>


        <Route path="/studygroups" element={<StudyGroups></StudyGroups>}></Route>


        <Route path="/subjects" element={<Subjects></Subjects>}></Route>

        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </div>
  );
}

export default App;

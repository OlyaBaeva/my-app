/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/


import React from 'react';
import './App.css';
import Epoch from'./Epoch';


const books = [
  { ID: 1, Name: 'Отель у погибшего альпиниста', year: '1969', path:"1.jpg" },
  { ID: 2, Name: 'Понедельник начинается в субботу', year: '1965', path:"2.jpg" },
  { ID: 3, Name: 'Страна Багровых туч', year: '1959', path:"3.jpg" },              
];

function App() {
  return (
      <div>
      
      <Epoch books={books}/>
      </div>
      );
}
export default App;


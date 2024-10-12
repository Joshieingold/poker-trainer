import React from 'react';
import Actions from "./components/Actions/actions.jsx";
import Navbar from './components/Navbar/navbar.jsx';
import PokerTable from './components/PokerTable.jsx';

function App() {
  return (
    <div className="App">
      <Navbar />
      <PokerTable />
      <Actions />
    </div>
  );
}

export default App;

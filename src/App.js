import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/styles.css';
import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';

import Connect from './Components/Modals/ConnectModal';
import WalletConnectClass from './assets/js/WalletConnect';
import View from './Pages/View'
import Subscribe from './Pages/Subscribe';
import Create from './Pages/Create';
import Success from './Pages/Success';
import MySubscriptions from './Pages/MySubscriptions';

function App() {

  const [theme,setTheme] = React.useState("dark-theme");
  const [connect, setConnect] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  
  return (
    <Router basename='/'>
      <div className="App">
        <Connect
          openModal={connect}
          closeModal={() => setConnect(false)}
          setAccounts={(accounts) => {
            if(accounts.length > 0) {
              setConnect(!connect);
              setAccounts(accounts);
            }
            
          }}
        />
        
        <Navbar
          connectWallet={() => setConnect(!connect)} 
          changeTheme={(theme) => setTheme(theme)}
          accounts={accounts}
          disconnectWallet={() => {
            setAccounts([]);
            WalletConnectClass.disconnectWallet();
          }}
          />
        
        <header className={theme}>
          <Routes>
            <Route path="/" element={<View />} />
            <Route path="/subscribe/:id" element={<Subscribe />} />
            <Route path="/create" element={<Create />} />
            <Route path="/success" element={<Success />} />
            <Route path="/my-subscriptions" element={<MySubscriptions />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </header>
      </div>
    </Router>
    
  );
}

export default App;

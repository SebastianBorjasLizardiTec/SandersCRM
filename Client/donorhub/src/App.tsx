import React from 'react';
import Login from './credentials/login';

const App: React.FC = () => {
  console.log('App component rendering');
  return (
    <React.StrictMode>
      <Login />
    </React.StrictMode>
  );
};

export default App;
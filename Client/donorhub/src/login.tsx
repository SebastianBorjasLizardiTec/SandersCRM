import React from 'react';
import './credentials.css';

const Login: React.FC = () => {
  return (
    <div className="container">
      <div className="content">
        <h1 className="logo">DONNOR HUB</h1>
        <div className = "data-container" >
          <h1 className="title">Sign up...</h1>
          <input type="text" className="text-input" placeholder='Name' />
        </div>
      </div>
      <div className="image-container">
      </div>
    </div>
  );
};

export default Login;
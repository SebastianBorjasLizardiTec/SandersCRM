import React from 'react';
import { colors } from './colors'; 

const Login: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex',}}>
        <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.ourBackground }}>
            <h1 style = {{color: colors.ourDarkBlue}}>DONNOR HUB</h1>
        </div>
    </div>
  );
};

export default Login;
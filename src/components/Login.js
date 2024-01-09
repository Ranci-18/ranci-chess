import React from 'react';
import './Login.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from './firebase';

export default function Login({ onLogin, onSignup }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    function goToSignup() {
        onSignup(true);
    }

    async function handleLogin() {
        const auth = getAuth(app);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            onLogin(true);
            setEmail('');
            setPassword('');
        } catch (error) {
            alert(`${error.code}, ${error.message}`);
        }
    }
  return (
    <div className='login'>
        <h1>Login</h1>
        <br />
        <label htmlFor='email'>
            Email:
            <br />
            <input id='email' type='email' placeholder='email'
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
        </label>
        <br />
        <label htmlFor='password'>
            Password:
            <br />
            <input id='password' type='password' placeholder='password' 
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
        </label>
        <br />
        <button type='button' 
            onClick={handleLogin}
        >
            Login
        </button>
        or:
        <button onClick={goToSignup}>Go to Signup</button>
    </div>
  )
}

import React from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from './firebase';
import './Signup.css';

export default function Signup({ onSignup }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    

    async function handleSignup() {
        const auth = getAuth(app);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            onSignup(true);
            setEmail('');
            setPassword('');
            alert('Signup successful!');
        } catch (error) {
            alert(`${error.code}, ${error.message}`);
        }
    }
  return (
    <div htmlFor='email' className='signup'>
        <label htmlFor='signup'>
            <h2>Sign Up</h2>
            <br />
            <br />
            Email:
            <br />
            <input id='signup' type='email' placeholder='abc@gmail.com'
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
        </label>
        <br />
        <label htmlFor='password'>
            Password:
            <br />
            <input id='password' type='password' placeholder='********'
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
        </label>
        <br />
        <button type='button' onClick={handleSignup}>Sign Up</button>
        or:
        <button onClick={() => onSignup(true)}>Go to Login</button>
    </div>
  )
}

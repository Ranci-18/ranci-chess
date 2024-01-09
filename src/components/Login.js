import React from 'react'

export default function Login() {
  return (
    <label htmlFor='login'>
        Email:
        <input id='login' type='email' placeholder='email' />
        Password:
        <input id='login' type='password' placeholder='password' /> 
        <button type='button'>Login</button>
    </label>
  )
}

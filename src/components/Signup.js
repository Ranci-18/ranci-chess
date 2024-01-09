import React from 'react'

export default function Signup() {
  return (
    <label htmlFor='signup'>
        Email:
        <input id='signup' type='email' placeholder='abc@gmail.com' />
        Password:
        <input id='signup' type='password' placeholder='********' />
        <button type='button'>Sign Up</button>
    </label>
  )
}

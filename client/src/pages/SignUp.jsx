import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (event) => {
    event.preventDefault();
    console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='p-6 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-semibold my-7'>Registracija</h1>
      
      <form className='flex flex-col gap-6'>
        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg text-xl'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg text-xl'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg text-xl'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase text-xl hover:opacity-95 disabled:opacity-80'>
          Sign up
        </button>
      </form>

      <div className='flex gap-2 mt-8'>
        <p className='text-xl'>Imate račun?</p>
        <Link to='/sign-in' className='text-blue-700 text-xl'>
          Prijavite se
        </Link>
      </div>
    </div>
  );
}

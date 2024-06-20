import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-6 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-semibold my-7'>Prijava</h1>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg text-xl'
          id='email'
          onChange={handleChange}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg text-xl'
          id='password'
          onChange={handleChange}
          required
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase text-xl hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <div className='flex gap-2 mt-8'>
        <p className='text-xl'>Nemate račun?</p>
        <Link to='/sign-up' className='text-blue-700 text-xl'>
          Registrirajte se
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
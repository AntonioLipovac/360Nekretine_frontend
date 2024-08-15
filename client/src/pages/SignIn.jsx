import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <div className='relative py-20 px-6 max-w-3xl mx-auto mt-12'>
      <div
        className='bg-blue-950 p-8 rounded-lg shadow-lg relative overflow-hidden'
        style={{
          backgroundImage: `url('/putanja-do-slike-pozadine.jpg')`, // Zamijeniti s putanjom do stvarne slike
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className='bg-blue-950 bg-opacity-80 p-8 rounded-lg'>
          <h1 className='text-4xl font-semibold mb-6 text-yellow-500 text-center'>
            Prijava
          </h1>

          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <input
              type='email'
              placeholder='Email'
              className='border border-yellow-500 p-3 rounded-lg text-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
              id='email'
              onChange={handleChange}
              required
            />
            <input
              type='password'
              placeholder='Lozinka'
              className='border border-yellow-500 p-3 rounded-lg text-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
              id='password'
              onChange={handleChange}
              required
            />
            <button
              type='submit'
              disabled={loading}
              className='bg-yellow-500 text-white p-3 rounded-lg uppercase text-xl font-semibold hover:bg-yellow-600 disabled:bg-yellow-300 transition'
            >
              {loading ? 'Učitavanje...' : 'Prijava'}
            </button>
            <OAuth />
          </form>

          <div className='flex flex-col items-center gap-2 mt-8'>
            <p className='text-xl text-white'>Nemate račun?</p>
            <Link to='/sign-up' className='text-yellow-500 text-xl font-semibold underline'>
              Registrirajte se
            </Link>
          </div>

          {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
        </div>
      </div>
    </div>
  );
}

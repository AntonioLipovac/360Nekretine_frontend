import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-6 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-semibold my-7'>Registracija</h1>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <input
          type='text'
          placeholder='Korisničko ime'
          className='border p-4 rounded-lg text-xl'
          id='username'
          onChange={handleChange}
          required
        />
        <input
          type='email'
          placeholder='Email'
          className='border p-4 rounded-lg text-xl'
          id='email'
          onChange={handleChange}
          required
        />
        <input
          type='password'
          placeholder='Lozinka'
          className='border p-4 rounded-lg text-xl'
          id='password'
          onChange={handleChange}
          required
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-slate-700 text-white p-4 rounded-lg uppercase text-xl hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Učitavanje...' : 'Registracija'}
        </button>
        <OAuth/>
       </form>

      <div className='flex gap-4 mt-8'>
        <p className='text-xl'>Imate račun?</p>
        <Link to='/sign-in' className='text-blue-700 text-xl'>
          Prijavite se
        </Link>
      </div>
      {error && <p className='text-red-500 mt-8'>{error}</p>}
    </div>
  );
}

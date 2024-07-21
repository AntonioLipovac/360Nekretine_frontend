import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className='bg-blue-950 shadow-lg'>
      <div className='flex justify-between items-center max-w-7xl mx-auto py-4 px-6'>
        <Link to='/'>
          <h1 className='font-semibold text-lg sm:text-2xl flex items-baseline'>
            <span className='text-white'>Nekretnine</span>
            <span className='text-gray-400 ml-1'>360</span>
          </h1>
        </Link>
        <form className='bg-white px-4 py-2 rounded-full flex items-center'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-32 sm:w-72 text-gray-800'
          />
          <button type='submit'>
            <FaSearch className='text-gray-600 ml-2' />
          </button>
        </form>
        <nav>
          <ul className='flex gap-8'>
            <li>
              <Link to='/' className='hidden sm:inline text-white hover:text-orange-500'>
                Početna
              </Link>
            </li>
            <li>
              <Link to='/about' className='hidden sm:inline text-white hover:text-orange-500'>
                O nama
              </Link>
            </li>
            <li>
              <Link to='/profile'>
                {currentUser ? (
                  <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                ) : (
                  <span className='text-white hover:text-orange-500'>Prijava</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
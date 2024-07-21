import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='p-6 max-w-lg mx-auto'>
      <h1 className='text-4xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-6'>
        <img src={currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <input type="text" placeholder='Korisničko ime' id='username' className='border p-4 rounded-lg text-xl' />
        <input type="email" placeholder='Email' id='email' className='border p-4 rounded-lg text-xl' />
        <input type="password" placeholder='Lozinka' id='password' className='border p-4 rounded-lg text-xl' />
        <button className='bg-slate-700 text-white rounded-lg p-4 uppercase text-xl hover:opacity-95 disabled:opacity-80'>Ažuriranje</button>
      </form>
      <div className="flex justify-between mt-8">
        <span className='text-red-700 text-xl cursor-pointer'>Brisanje računa</span>
        <span className='text-red-700 text-xl cursor-pointer'>Odjava</span>
      </div>
    </div>
  );
}

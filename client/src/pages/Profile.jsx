import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    return () => {
      setFileUploadError(false);
      setFilePerc(0);
    };
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL }))
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='relative py-8 px-6 max-w-4xl mx-auto'>
      <div
        className='bg-blue-950 p-6 rounded-lg shadow-lg relative overflow-hidden'
        style={{
          backgroundImage: `url('/putanja-do-slike-pozadine.jpg')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className='bg-blue-950 bg-opacity-80 p-6 rounded-lg'>
          <h1 className='text-3xl font-semibold mb-4 text-[#fbbf24] text-center'>
            Moj Profil
          </h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
            />
            <div className='flex flex-col items-center'>
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                alt='profil'
                className='rounded-full h-28 w-28 object-cover cursor-pointer mb-4'
              />
              <p className='text-sm'>
                {fileUploadError ? (
                  <span className='text-red-500'>
                    Greška pri učitavanju slike (slika mora biti manja od 2 MB)
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className='text-gray-200'>{`Učitavanje ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className='text-green-500'>Slika uspješno učitana!</span>
                ) : (
                  ''
                )}
              </p>
            </div>
            <input
              type='text'
              placeholder='Korisničko ime'
              defaultValue={currentUser.username}
              id='username'
              className='border border-yellow-500 p-3 rounded-lg text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
              onChange={handleChange}
            />
            <input
              type='email'
              placeholder='Email'
              id='email'
              defaultValue={currentUser.email}
              className='border border-yellow-500 p-3 rounded-lg text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='Lozinka'
              onChange={handleChange}
              id='password'
              className='border border-yellow-500 p-3 rounded-lg text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
            />
            <button
              disabled={loading}
              className='bg-yellow-500 text-white p-3 rounded-lg uppercase text-base font-semibold hover:bg-yellow-600 disabled:bg-yellow-300 transition'
            >
              {loading ? 'Učitavanje...' : 'Ažuriraj'}
            </button>
            <Link
              className='bg-yellow-500 text-white p-3 rounded-lg uppercase text-center text-base font-semibold hover:bg-yellow-600 transition'
              to={'/create-listing'}
            >
              Kreirajte oglas
            </Link>
          </form>
          <div className='flex justify-between mt-4'>
            <span
              onClick={handleDeleteUser}
              className='text-white cursor-pointer font-semibold text-sm'
            >
              Izbriši račun
            </span>
            <span
              onClick={handleSignOut}
              className='text-white cursor-pointer font-semibold text-sm'
            >
              Odjava
            </span>
          </div>
          <p className='text-red-500 mt-4 text-sm'>
            {error ? error : ''}
          </p>
          <p className='text-green-500 mt-4 text-sm'>
            {updateSuccess ? 'Korisnik je uspješno ažuriran!' : ''}
          </p>
          <button
            onClick={handleShowListings}
            className='bg-yellow-500 text-white w-full font-semibold p-3 rounded-lg mt-4 hover:bg-yellow-600 transition'
          >
            Prikaži moje oglase
          </button>
          {showListingsError && (
            <p className='text-red-500 text-sm mt-2'>
              Došlo je do greške prilikom prikazivanja oglasa.
            </p>
          )}
          {userListings && userListings.length > 0 && (
            <div className='flex flex-col gap-4 mt-5'>
              <h2 className='text-center text-2xl font-semibold text-white'>
                Vaši oglasi
              </h2>
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='border border-yellow-500 rounded-lg p-3 flex justify-between items-center gap-4'
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt='naslovna slika'
                      className='h-16 w-16 object-cover'
                    />
                  </Link>
                  <Link
                    className='text-white font-semibold hover:underline truncate flex-1'
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>
                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='text-white uppercase text-sm'
                    >
                      Obriši
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-white uppercase text-sm'>
                        Uredi
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

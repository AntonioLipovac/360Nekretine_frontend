import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Neuspješno učitavanje slike (maksimalno 2 MB po slici)');
          setUploading(false);
        });
    } else {
      setImageUploadError('Možete učitati samo 6 slika po oglasu');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Učitavanje je ${progress}% završeno`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('Morate učitati barem jednu sliku');
      if (+formData.regularPrice < 0)
        return setError('Cijena mora biti pozitivna');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-6 max-w-4xl mx-auto bg-blue-950 text-white mt-20'>
      <h1 className='text-3xl font-semibold text-center my-7 text-yellow-500'>
        Kreirajte oglas
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Naziv'
            className='border border-yellow-500 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Opis'
            className='border border-yellow-500 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Adresa'
            className='border border-yellow-500 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex items-center gap-2'>
              <input
                type='radio'
                id='sale'
                name='type'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <label htmlFor='sale'>Prodaja</label>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='radio'
                id='rent'
                name='type'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <label htmlFor='rent'>Najam</label>
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor='parking'>Parkirno mjesto</label>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor='furnished'>Namješteno</label>
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col md:flex-row items-center gap-4'>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-yellow-500 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <label htmlFor='bedrooms'>Sobe</label>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-yellow-500 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <label htmlFor='bathrooms'>Kupatila</label>
              </div>
            </div>

            <div className='flex flex-col md:flex-row items-center gap-4'>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='regularPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-yellow-500 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <label htmlFor='regularPrice'>Redovna cijena (EUR)</label>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <label
            htmlFor='imageUrls'
            className='flex flex-col items-center justify-center p-6 border border-yellow-500 rounded-lg cursor-pointer bg-blue-950'
          >
            <input
              type='file'
              id='imageUrls'
              multiple
              accept='.jpg, .jpeg, .png'
              className='hidden'
              onChange={(e) => setFiles(e.target.files)}
            />
            <span className='text-center text-yellow-500'>
              Odaberite slike
            </span>
          </label>
          {imageUploadError && (
            <p className='text-red-500 text-center'>{imageUploadError}</p>
          )}
          {files.length > 0 && (
            <button
              type='button'
              onClick={handleImageSubmit}
              disabled={uploading}
              className='bg-yellow-500 text-blue-950 py-2 px-4 rounded-lg disabled:bg-gray-500'
            >
              {uploading ? 'Učitavanje...' : 'Učitajte slike'}
            </button>
          )}
          <div className='grid grid-cols-3 gap-4'>
            {formData.imageUrls.map((url, index) => (
              <div key={index} className='relative'>
                <img src={url} alt='Upload' className='w-full h-full object-cover rounded-lg' />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className='text-red-500 text-center'>{error}</p>}
        <button
          type='submit'
          disabled={loading}
          className='bg-yellow-500 text-blue-950 py-2 px-4 rounded-lg disabled:bg-gray-500 mt-6 mx-auto block'
        >
          {loading ? 'Slanje...' : 'Kreiraj oglas'}
        </button>
      </form>
    </main>
  );
}

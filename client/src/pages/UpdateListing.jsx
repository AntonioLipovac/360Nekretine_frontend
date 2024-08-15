import { useEffect, useState, useCallback } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'najam',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchListing = useCallback(async () => {
    try {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      } else {
        setFormData(data);
      }
    } catch (error) {
      setError('Došlo je do greške prilikom preuzimanja podataka.');
    }
  }, [params.listingId]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleImageSubmit = async () => {
    if (files.length === 0) {
      setImageUploadError('Niste odabrali niti jednu sliku.');
      return;
    }
    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('Možete učitati samo 6 slika po oglasu.');
      return;
    }

    setUploading(true);
    setImageUploadError('');
    const promises = [];

    try {
      for (const file of files) {
        promises.push(storeImage(file));
      }
      const urls = await Promise.all(promises);
      setFormData((prevData) => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, ...urls],
      }));
    } catch (error) {
      setImageUploadError('Neuspješno učitavanje slika (maksimalno 2 MB po slici).');
    } finally {
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      return setError('Morate učitati barem jednu sliku.');
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      return setError('Cijena s popustom mora biti manja od redovne cijene.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
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

      if (!data.success) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError('Došlo je do greške prilikom ažuriranja oglasa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='p-4 max-w-4xl mx-auto'>
      <h1 className='text-4xl font-semibold text-center mb-10'>
        Ažuriraj Oglas
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <input
          type='text'
          placeholder='Naziv'
          className='border p-4 rounded-lg text-lg'
          id='name'
          maxLength='62'
          minLength='10'
          required
          onChange={handleChange}
          value={formData.name}
        />
        <textarea
          placeholder='Opis'
          className='border p-4 rounded-lg text-lg'
          id='description'
          required
          onChange={handleChange}
          value={formData.description}
        />
        <input
          type='text'
          placeholder='Adresa'
          className='border p-4 rounded-lg text-lg'
          id='address'
          required
          onChange={handleChange}
          value={formData.address}
        />
        <div className='flex gap-4 flex-wrap'>
          <div className='flex gap-2 items-center'>
            <input
              type='radio'
              id='prodaja'
              className='w-5 h-5'
              checked={formData.type === 'prodaja'}
              onChange={handleChange}
            />
            <label htmlFor='prodaja' className='text-lg'>Prodaja</label>
          </div>
          <div className='flex gap-2 items-center'>
            <input
              type='radio'
              id='najam'
              className='w-5 h-5'
              checked={formData.type === 'najam'}
              onChange={handleChange}
            />
            <label htmlFor='najam' className='text-lg'>Najam</label>
          </div>
          <div className='flex gap-2 items-center'>
            <input
              type='checkbox'
              id='parking'
              className='w-5 h-5'
              checked={formData.parking}
              onChange={handleChange}
            />
            <label htmlFor='parking' className='text-lg'>Parkirno mjesto</label>
          </div>
          <div className='flex gap-2 items-center'>
            <input
              type='checkbox'
              id='furnished'
              className='w-5 h-5'
              checked={formData.furnished}
              onChange={handleChange}
            />
            <label htmlFor='furnished' className='text-lg'>Namješteno</label>
          </div>
          <div className='flex gap-2 items-center'>
            <input
              type='checkbox'
              id='offer'
              className='w-5 h-5'
              checked={formData.offer}
              onChange={handleChange}
            />
            <label htmlFor='offer' className='text-lg'>Ponuda</label>
          </div>
        </div>
        <div className='flex flex-wrap gap-6'>
          <div className='flex flex-col'>
            <label htmlFor='bedrooms' className='text-lg mb-1'>Spavaće sobe</label>
            <input
              type='number'
              id='bedrooms'
              min='1'
              max='10'
              className='p-4 border border-gray-300 rounded-lg text-lg'
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='bathrooms' className='text-lg mb-1'>Kupaonice</label>
            <input
              type='number'
              id='bathrooms'
              min='1'
              max='10'
              className='p-4 border border-gray-300 rounded-lg text-lg'
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='regularPrice' className='text-lg mb-1'>Redovna cijena</label>
            <input
              type='number'
              id='regularPrice'
              min='50'
              max='400000000'
              className='p-4 border border-gray-300 rounded-lg text-lg'
              value={formData.regularPrice}
              onChange={handleChange}
              required
            />
          </div>
          {formData.offer && (
            <div className='flex flex-col'>
              <label htmlFor='discountPrice' className='text-lg mb-1'>Cijena s popustom</label>
              <input
                type='number'
                id='discountPrice'
                min='50'
                max='400000000'
                className='p-4 border border-gray-300 rounded-lg text-lg'
                value={formData.discountPrice}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>
        <div className='flex flex-col'>
          <label htmlFor='images' className='text-lg mb-1'>Slike</label>
          <input
            type='file'
            id='images'
            accept='.jpg,.png,.jpeg'
            className='p-4 border border-gray-300 rounded-lg text-lg'
            onChange={(e) => setFiles(e.target.files)}
            multiple
          />
          {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
          <button
            type='button'
            onClick={handleImageSubmit}
            disabled={uploading}
            className='mt-2 py-3 px-6 text-lg font-semibold text-white bg-blue-600 rounded-lg'
          >
            {uploading ? 'Učitavanje...' : 'Učitaj slike'}
          </button>
          <div className='flex flex-wrap gap-4 mt-4'>
            {formData.imageUrls.map((url, index) => (
              <div key={index} className='relative w-32 h-32'>
                <img
                  src={url}
                  alt={`Listing Image ${index + 1}`}
                  className='object-cover w-full h-full rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full'
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type='submit'
          disabled={loading}
          className='py-3 px-6 text-lg font-semibold text-white bg-green-600 rounded-lg'
        >
          {loading ? 'Ažuriranje...' : 'Ažuriraj oglas'}
        </button>
        {error && <p className='text-red-500 mt-4'>{error}</p>}
      </form>
    </main>
  );
}

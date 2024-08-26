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

export default function UpdateListing() {
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
    <main className='p-6 max-w-4xl mx-auto bg-blue-950 text-white mt-20'>
      <h1 className='text-3xl font-semibold text-center my-7 text-yellow-500'>
        Uredi oglas
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
                id='prodaja'
                name='type'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'prodaja'}
              />
              <label htmlFor='prodaja'>Prodaja</label>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='radio'
                id='najam'
                name='type'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'najam'}
              />
              <label htmlFor='najam'>Najam</label>
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
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor='offer'>Ponuda</label>
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
                <label htmlFor='bathrooms'>Kupaonice</label>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex flex-col'>
                <input
                  type='number'
                  id='regularPrice'
                  required
                  className='p-3 border border-yellow-500 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <label htmlFor='regularPrice'>Redovna cijena</label>
              </div>
              {formData.offer && (
                <div className='flex flex-col'>
                  <input
                    type='number'
                    id='discountPrice'
                    required={formData.offer}
                    className='p-3 border border-yellow-500 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <label htmlFor='discountPrice'>Cijena s popustom</label>
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <label className='text-lg font-semibold'>Dodajte slike</label>
            <input
              type='file'
              id='images'
              onChange={(e) => setFiles(e.target.files)}
              multiple
              accept='.jpg,.png,.jpeg'
              className='p-3 border border-yellow-500 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
            />
            {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
            <button
              type='button'
              onClick={handleImageSubmit}
              className='bg-yellow-500 text-blue-950 p-3 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'
            >
              {uploading ? 'Učitavanje...' : 'Učitaj slike'}
            </button>
          </div>

          <div className='grid grid-cols-2 gap-4 mt-4'>
            {formData.imageUrls.map((url, index) => (
              <div key={index} className='relative'>
                <img
                  src={url}
                  alt={`Slika ${index + 1}`}
                  className='w-full h-48 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full'
                >
                  Ukloni
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <button
          type='submit'
          disabled={loading}
          className='bg-yellow-500 text-blue-950 p-3 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'
        >
          {loading ? 'Spremanje...' : 'Spremi promjene'}
        </button>
        {error && <p className='text-red-500'>{error}</p>}
      </form>
    </main>
  );
}

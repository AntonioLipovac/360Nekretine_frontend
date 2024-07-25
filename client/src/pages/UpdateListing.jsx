import { useEffect, useState } from 'react';
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
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

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
          setImageUploadError('Neuspješno učitavanje slika (maksimalno 2 MB po slici)');
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
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
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
    try {
      if (formData.imageUrls.length < 1)
        return setError('Morate učitati barem jednu sliku');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Cijena s popustom mora biti manja od redovne cijene');
      setLoading(true);
      setError(false);
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
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
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
            <label htmlFor='regularPrice' className='text-lg mb-1'>Redovna cijena (€ / mjesec)</label>
            <input
              type='number'
              id='regularPrice'
              min='50'
              max='10000000'
              className='p-4 border border-gray-300 rounded-lg text-lg'
              value={formData.regularPrice}
              onChange={handleChange}
              required
            />
          </div>
          {formData.offer && (
            <div className='flex flex-col'>
              <label htmlFor='discountPrice' className='text-lg mb-1'>Cijena s popustom (€ / mjesec)</label>
              <input
                type='number'
                id='discountPrice'
                min='0'
                max='10000000'
                className='p-4 border border-gray-300 rounded-lg text-lg'
                value={formData.discountPrice}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <label className='font-semibold text-lg'>
            Slike:
            <span className='font-normal text-gray-600 ml-2 text-base'>Prva slika će biti naslovna (maksimalno 6 slika)</span>
          </label>
          <div className='flex gap-4 items-center'>
            <label className='bg-slate-700 text-white p-4 rounded-lg uppercase hover:opacity-95 cursor-pointer'>
              Odaberite slike
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='hidden'
                type='file'
                id='slike'
                accept='image/*'
                multiple
              />
            </label>
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 text-lg'
            >
              {uploading ? 'Učitavanje...' : 'Učitaj'}
            </button>
          </div>
          {files.length === 0 && <p className='text-sm text-gray-600'>Nijedna slika nije odabrana!</p>}
          {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}
          {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-3 border items-center'>
              <img src={url} alt='slika oglasa' className='w-20 h-20 object-contain rounded-lg' />
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
              >
                Obriši
              </button>
            </div>
          ))}
        </div>
        <button
          disabled={loading || uploading}
          className='p-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 text-lg'
        >
          {loading ? 'Ažuriranje...' : 'Ažurirajte oglas'}
        </button>
        {error && <p className='text-red-700 text-sm'>{error}</p>}
      </form>
    </main>
  );
}

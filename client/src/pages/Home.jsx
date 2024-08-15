import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Pocetna() {
  const [prodajaNekretnina, setProdajaNekretnina] = useState([]);
  const [najamNekretnina, setNajamNekretnina] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const dohvatiNekretnineZaNajam = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setNajamNekretnina(data);
      } catch (error) {
        console.log(error);
      }
    };

    const dohvatiNekretnineZaProdaju = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setProdajaNekretnina(data);
      } catch (error) {
        console.log(error);
      }
    };

    dohvatiNekretnineZaNajam();
    dohvatiNekretnineZaProdaju();
  }, []);

  return (
    <div>
      {/* Gornji dio s pozadinom */}
      <div className='relative py-28 px-6 max-w-6xl mx-auto mt-12'>
        <div
          className='bg-blue-950 p-10 rounded-lg shadow-lg relative'
          style={{
            backgroundImage: `url('/putanja-do-slike-nekretnine.jpg')`, // Zamijeniti s putanjom do stvarne slike
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className='bg-blue-950 bg-opacity-75 p-10 rounded-lg'>
            <h1 className='text-4xl font-bold mb-6 text-white'>
              Pronađite svoju sljedeću savršenu nekretninu s lakoćom
            </h1>
            <div className='text-white text-lg mb-6'>
              Dobrodošli na Nekretnine 360 – vaše najbolje mjesto za pronalazak nove nekretnine.
              <br />
              Jednostavno pretražujte, pronađite ili oglasite nekretninu uz našu pomoć.
            </div>
            <Link
              to={'/pretraga'}
              className='text-sm text-blue-300 font-bold hover:underline'
            >
              Započnimo...
            </Link>
          </div>
        </div>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {najamNekretnina &&
          najamNekretnina.length > 0 &&
          najamNekretnina.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Prikaz nekretnina za prodaju i najam */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {najamNekretnina && najamNekretnina.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Najnovije nekretnine za najam</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/pretraga?type=rent'}>
                Prikaži više nekretnina za najam
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {najamNekretnina.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {prodajaNekretnina && prodajaNekretnina.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Najnovije nekretnine za prodaju</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/pretraga?type=sale'}>
                Prikaži više nekretnina za prodaju
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {prodajaNekretnina.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

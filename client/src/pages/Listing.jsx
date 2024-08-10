import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (!data.success) {
          setError('Nešto je pošlo po zlu!');
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError('Nešto je pošlo po zlu!');
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Učitavanje...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>{error}</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation={true} modules={[Navigation]}>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}

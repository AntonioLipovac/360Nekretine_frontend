import React from 'react';
import { FaCheck, FaHome, FaBullhorn, FaLightbulb, FaGem } from 'react-icons/fa';

export default function About() {
  return (
    <div className='py-6 px-4 max-w-6xl mx-auto mt-6'>
      <div
        className='bg-blue-950 p-6 rounded-lg shadow-md relative overflow-hidden'
        style={{
          backgroundImage: `url('/images/zgrade.jpg')`, // Zamijeniti s putanjom do stvarne slike
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className='bg-blue-950 bg-opacity-80 p-6 rounded-lg'>
          <h1 className='text-4xl font-bold mb-6 text-yellow-500 flex items-center'>
            <FaHome className='mr-3 text-yellow-500' />
            O nama
          </h1>
          <p className='mb-4 text-white text-base'>
            Dobrodošli na <strong className='text-yellow-500'>Nekretnine 360</strong>, vašeg pouzdanog partnera u svijetu nekretnina. Naša misija je učiniti proces kupnje, prodaje i iznajmljivanja nekretnina jednostavnim, transparentnim i pristupačnim svima.
          </p>
          <h2 className='text-2xl font-semibold mb-3 text-yellow-500 flex items-center'>
            <FaHome className='mr-2 text-yellow-500' />
            Tko smo mi?
          </h2>
          <p className='mb-4 text-white text-base'>
            <strong className='text-yellow-500'>Nekretnine 360</strong> nastale su iz potrebe za stvaranjem platforme koja na učinkovit i intuitivan način povezuje prodavače i kupce nekretnina. Naša platforma olakšava pretragu nekretnina, pruža sve potrebne informacije na jednom mjestu te omogućuje brzo i jednostavno stupanje u kontakt s prodavačem ili kupcem.
          </p>
          <h2 className='text-2xl font-semibold mb-3 text-yellow-500 flex items-center'>
            <FaLightbulb className='mr-2 text-yellow-500' />
            Naša vizija
          </h2>
          <p className='mb-4 text-white text-base'>
            Vjerujemo da je tržište nekretnina složeno, ali da proces kupnje i prodaje ne mora biti takav. Naša vizija je postati lider u digitalizaciji tržišta nekretnina, pružajući vrhunsko korisničko iskustvo i transparentnost u svim fazama transakcije.
          </p>
          <h2 className='text-2xl font-semibold mb-3 text-yellow-500 flex items-center'>
            <FaBullhorn className='mr-2 text-yellow-500' />
            Što nudimo?
          </h2>
          <ul className='mb-4 text-white text-base list-disc list-inside space-y-1'>
            <li>Pretraživati široku ponudu nekretnina koje odgovaraju vašim potrebama.</li>
            <li>Postavljati oglase s detaljnim opisom i slikama nekretnine koju prodajete.</li>
            <li>Stupati u izravan kontakt sa zainteresiranim kupcima ili prodavačima.</li>
            <li>Pratiti trendove na tržištu nekretnina i dobiti korisne savjete za kupnju ili prodaju.</li>
          </ul>
          <h2 className='text-2xl font-semibold mb-3 text-yellow-500 flex items-center'>
            <FaGem className='mr-2 text-yellow-500' />
            Zašto smo drugačiji?
          </h2>
          <p className='text-white text-base'>
            Ono što nas izdvaja je naša posvećenost korisnicima. Trudimo se pružiti vam najpreciznije i najnovije informacije, jednostavno korisničko iskustvo i podršku u svakom koraku vašeg puta do idealne nekretnine. Uz našu platformu, možete biti sigurni da su vaši oglasi vidljivi pravim ljudima, dok vi imate pristup najpouzdanijim informacijama.
          </p>
        </div>
      </div>
    </div>
  );
}

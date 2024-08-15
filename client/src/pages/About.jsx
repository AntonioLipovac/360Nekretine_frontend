import React from 'react';

export default function About() {
  return (
    <div className='py-8 px-4 max-w-6xl mx-auto mt-8'>
      <div
        className='bg-blue-950 p-8 rounded-lg shadow-lg relative'
        style={{
          backgroundImage: `url('/putanja-do-slike-nekretnine.jpg')`, // Zamijeniti s putanjom do stvarne slike
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className='bg-blue-950 bg-opacity-75 p-6 rounded-lg'>
          <h1 className='text-4xl font-bold mb-4 text-white'>
            O nama
          </h1>
          <p className='mb-4 text-white text-lg'>
            Dobrodošli na <strong>Nekretnine 360</strong>, vašeg pouzdanog partnera u svijetu nekretnina. Naša misija je učiniti proces kupnje, prodaje i iznajmljivanja nekretnina jednostavnim, transparentnim i pristupačnim svima.
          </p>
          <p className='mb-4 text-white text-lg'>
            <strong>Tko smo mi?</strong> <br />
            <strong>Nekretnine 360</strong> nastale su iz potrebe za stvaranjem platforme koja na učinkovit i intuitivan način povezuje prodavače i kupce nekretnina. Naša platforma osmišljena je kako bi olakšala pretragu nekretnina, pružila sve potrebne informacije na jednom mjestu te omogućila brzo i jednostavno stupanje u kontakt s prodavačem ili kupcem.
          </p>
          <p className='mb-4 text-white text-lg'>
            <strong>Naša vizija</strong> <br />
            Vjerujemo da je tržište nekretnina složeno, ali da proces kupnje i prodaje ne mora biti takav. Naša vizija je postati lider u digitalizaciji tržišta nekretnina, pružajući vrhunsko korisničko iskustvo i transparentnost u svim fazama transakcije. Cilj nam je stvoriti zajednicu zadovoljnih korisnika koji će uvijek znati gdje mogu pronaći svoju sljedeću nekretninu ili kupca.
          </p>
          <p className='mb-4 text-white text-lg'>
            <strong>Što nudimo?</strong> <br />
            Na <strong>Nekretnine 360</strong> možete brzo i jednostavno:
            <ul className='list-disc list-inside'>
              <li>Pretraživati široku ponudu nekretnina koje odgovaraju vašim potrebama.</li>
              <li>Postavljati oglase s detaljnim opisom i slikama nekretnine koju prodajete.</li>
              <li>Stupati u izravan kontakt sa zainteresiranim kupcima ili prodavačima.</li>
              <li>Pratiti trendove na tržištu nekretnina i dobiti korisne savjete za kupnju ili prodaju.</li>
            </ul>
          </p>
          <p className='mb-4 text-white text-lg'>
            <strong>Zašto smo drugačiji?</strong> <br />
            Ono što nas izdvaja je naša posvećenost korisnicima. Trudimo se pružiti vam najpreciznije i najnovije informacije, jednostavno korisničko iskustvo i podršku u svakom koraku vašeg puta do idealne nekretnine. Uz našu platformu, možete biti sigurni da su vaši oglasi vidljivi pravim ljudima, dok vi imate pristup najpouzdanijim informacijama.
          </p>
        </div>
      </div>
    </div>
  );
}

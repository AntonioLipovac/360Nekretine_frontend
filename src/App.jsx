import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Pocetna from './pages/Pocetna';
import Prijava from './pages/Prijava';
import Registracija from './pages/Registracija';
import ONama from './pages/ONama';
import Profil from './pages/Profil';
export default function App() {
  return (
    <BrowserRouter>
    <Routes>

    <Route path='/' element={<Pocetna />} />
    <Route path='/prijava' element={<Prijava />} />
    <Route path='/registracija' element={<Registracija />} />
    <Route path='/o-nama' element={<ONama />} />
    <Route path='/profil' element={<Profil />} />


    </Routes>
    </BrowserRouter>
  )
}

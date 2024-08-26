import { Route, Routes } from 'react-router-dom'
import Loginpage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/signup/SignUpPage'


function App() {
    return (
        <div className='flex max-w-6xl mx-auto'>
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/login' element={<Loginpage />} />
        </Routes>
    </div>

    )
}

export default App
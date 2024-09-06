import { Route, Routes } from 'react-router-dom'
import Loginpage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'


function App() {
    return (
        <div className='flex max-w-6xl mx-auto'>
            <Sidebar />
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/login' element={<Loginpage />} />
        </Routes>
            <RightPanel />
    </div>

    )
}

export default App
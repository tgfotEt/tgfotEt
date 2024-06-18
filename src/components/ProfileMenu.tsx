import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';

export const ProfileMenu = ({setIsLoggedIn, setIsProfileMenuOpen}) => {
    const [_, setCurrentPage] = useSearchParams();
    const SignOut = async () => {
        await signOut(auth);
        setIsLoggedIn(auth.currentUser ? true : false);
    };
    return (
        <>
            <div className='fixed inset-0 bg-transparent z-50' onClick={() => setIsProfileMenuOpen(false)}></div>
            <div className='fixed top-0 right-0 z-[60] w-64 shadow-lg mt-14 mr-3 bg-gray-700 rounded-xl flex flex-col p-2 border-[1px] border-gray-600'>
                <button className='profile-menu-btn' onClick={() => {setCurrentPage({p:'userqb'}); setIsProfileMenuOpen(false);}}>My Question Banks</button>
                <button className='profile-menu-btn' onClick={SignOut}>Sign Out</button>
            </div>
        </>
    );
}

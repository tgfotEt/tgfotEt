import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
export const ProfileMenu = ({setIsLoggedIn, setCurrentPage, setIsProfileMenuOpen}) => {
    const SignOut = async () => {
        await signOut(auth);
        setIsLoggedIn(auth.currentUser ? true : false);
    };
    return (
        <>
            <div className='absolute inset-0 bg-transparent z-50' onClick={() => setIsProfileMenuOpen(false)}></div>
            <div className='absolute top-0 right-0 z-[60] w-64 shadow-lg mt-14 mr-3 bg-gray-700 rounded-xl flex flex-col p-2 border-[1px] border-gray-600'>
                <button className='profile-menu-btn' onClick={() => {setCurrentPage('userqb'); setIsProfileMenuOpen(false);}}>My Question Banks</button>
                <button className='profile-menu-btn' onClick={() => {setCurrentPage('settings'); setIsProfileMenuOpen(false);}}>Settings</button>
                <button className='profile-menu-btn' onClick={SignOut}>Sign Out</button>
            </div>
        </>
    );
}

import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export const ProfileMenu = ({setIsLoggedIn, setCurrentPage}) => {
    const SignOut = async () => {
        await signOut(auth);
        setIsLoggedIn(auth.currentUser ? true : false);
    };
    return (
        <div className='absolute top-0 right-0 mt-14 mr-3 p-4 bg-gray-700 rounded-xl'>
            <button onClick={() => setCurrentPage('settings')}>Settings</button>
            <button onClick={SignOut}>Sign Out</button>
        </div>
    );
}

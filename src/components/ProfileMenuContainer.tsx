import { useState } from 'react';
import { auth } from '../config/firebase';
import { ProfileMenu } from './ProfileMenu';

export const ProfileMenuContainer = ({ setIsLoggedIn }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profilePicture = auth.currentUser!.photoURL!;
    return (
        <>
            <button className='m-3 fixed z-40 top-0 right-0 rounded-full' onClick={() => setIsProfileMenuOpen(true)}>
                <img src={profilePicture} alt="profile" className='w-8 h-8 rounded-full' /> 
            </button>
            { isProfileMenuOpen &&
                <ProfileMenu setIsLoggedIn={setIsLoggedIn} setIsProfileMenuOpen={setIsProfileMenuOpen} />
            }
        </>
    );
}

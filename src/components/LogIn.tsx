import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export const LogIn = ({setIsLoggedIn}) => {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        }
        catch (error) {
            console.warn(error);
            alert('Failed to log in. Please try again later');
            return;
        }
        const email = auth.currentUser!.email!;
        if (!email.endsWith('@yphs.tp.edu.tw')){
            await signOut(auth);
            alert('Failed to log in. Please log in with your school account');
            return;
        }
        if(email.includes('teacher')){
            await signOut(auth);
            alert('Failed to log in. Please log in with YOUR school account!');
            return;
        }
        setIsLoggedIn(true);
    };

    return (
        <div className='flex flex-col items-center gap-20 p-8'>
            <h1 className='text-7xl'>tgfotEt</h1>
            <button className='text-4xl bg-gray-700 rounded-md hover:bg-gray-600 p-5' onClick={signInWithGoogle}>Log In / Sign up with your yphs Google Account</button>
        </div>
    );
};

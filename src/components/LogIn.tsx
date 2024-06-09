import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export const LogIn = ({setIsLoggedIn}) => {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider);
        if (!auth.currentUser) {
            alert('Failed to log in');
            return;
        }
        const email = auth.currentUser.email!;
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
            <h1 className='text-9xl'>tgfotEt</h1>
            <button className='text-4xl' onClick={signInWithGoogle}>Log In / Sign up with your yphs Google Account</button>
        </div>
    );
};

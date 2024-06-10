import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as ls from '../config/ls';
export const LogIn = ({setIsLoggedIn}) => {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        }
        catch (error) {
            console.error(error);
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
        const userId = auth.currentUser!.uid;
        const userRef = doc(db, 'users', userId);
        const UserData = {
            qb: {}
        };
        try {
            const snapshot = await getDoc(userRef); console.log("reading user data");
            if (snapshot.exists()) {
                setIsLoggedIn(true);
                return;
            }
            await setDoc(userRef, UserData);
        } catch (error) {
            console.error(error);
            await signOut(auth);
            alert('Failed to log in. Please try again later');
            return;
        }
        setIsLoggedIn(true);
        ls.setData(UserData);
    };

    return (
        <div className='flex flex-col items-center gap-20 p-8'>
            <h1 className='text-9xl'>tgfotEt</h1>
            <button className='text-4xl' onClick={signInWithGoogle}>Log In / Sign up with your yphs Google Account</button>
        </div>
    );
};

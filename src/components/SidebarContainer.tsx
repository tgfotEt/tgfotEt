import { useState, useEffect } from 'react';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Sidebar } from './Sidebar';

export const SidebarContainer = ({setCurrentPage}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<DocumentData|null>(null);
    useEffect(() => {
        const getUserData = async () => {
            const user = auth.currentUser!;
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            setUserData(userDoc.data()!);
        };
        try {
            getUserData();
        } catch (error) {
            console.error(error);
        }
    });
    return (
        <>
            <button className='m-3 fixed z-50 top-0 left-0' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <img src={"/src/assets/nav.svg"} alt="nav" className='w-8 h-8' />
            </button>
            { isSidebarOpen &&
                <Sidebar setCurrentPage={setCurrentPage} setIsSidebarOpen={setIsSidebarOpen} userData={userData} />
            }
        </>
    );
}


import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { LogIn } from './LogIn';
import { PageContainer } from './PageContainer';
import { SidebarContainer } from './SidebarContainer';
import { ProfileMenuContainer } from './ProfileMenuContainer';

export const Content = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('about');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        });
    }, []);
    return (
        <>
            { isLoading 
                ? <div>Loading...</div>
                : isLoggedIn 
                ? <> <PageContainer currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <SidebarContainer setCurrentPage={setCurrentPage} />
                    <ProfileMenuContainer setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} /> </>
                : <LogIn setIsLoggedIn={setIsLoggedIn} /> 
            }
        </>
    );
};


import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import * as ls from '../config/ls';
import { LogIn } from './LogIn';
import { PageContainer } from './PageContainer';
import { SidebarContainer } from './SidebarContainer';
import { ProfileMenuContainer } from './ProfileMenuContainer';

export const Content = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('about');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await ls.initQBank(user.uid);
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


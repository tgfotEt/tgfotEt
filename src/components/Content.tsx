import { useState } from 'react';
import { auth } from '../config/firebase';
import { LogIn } from './LogIn';
import { PageContainer } from './PageContainer';
import { SidebarContainer } from './SidebarContainer';
import { ProfileMenuContainer } from './ProfileMenuContainer';

export const Content = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser ? true : false);
    const [currentPage, setCurrentPage] = useState('about');
    return (
        <>
            { !isLoggedIn 
                ? <LogIn setIsLoggedIn={setIsLoggedIn} /> 
                : <>
                    <PageContainer currentPage={currentPage} />
                    <SidebarContainer setCurrentPage={setCurrentPage} />
                    <ProfileMenuContainer setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />
                </>
            }
        </>
    );
};


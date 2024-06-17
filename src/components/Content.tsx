import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import * as ls from '../config/ls';
import { LogIn } from './LogIn';
import { PageContainer } from './PageContainer';
import { SidebarContainer } from './SidebarContainer';
import { ProfileMenuContainer } from './ProfileMenuContainer';
import { LoadingOverlay } from './LoadingOverlay';

export const Content = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
    }, []);
    return (
        <div className='text-gray-100 font-sans'> 
            { isLoggedIn 
                ? <LoadingOverlay func={ls.initQBank} >
                    <PageContainer />
                    <SidebarContainer />
                    <ProfileMenuContainer setIsLoggedIn={setIsLoggedIn} />
                </LoadingOverlay>
                : <LogIn setIsLoggedIn={setIsLoggedIn} /> 
            }
        </div>
    );
};


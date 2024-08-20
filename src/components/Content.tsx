import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auth } from '../config/firebase';
import * as ls from '../config/ls';
import { LogIn } from './LogIn';
import { PageContainer } from './PageContainer';
import { SidebarContainer } from './SidebarContainer';
import { ProfileMenuContainer } from './ProfileMenuContainer';
import { LoadingOverlay } from './LoadingOverlay';
import { ChangeLangButton } from '../config/lang';
export const Content = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, _] = useSearchParams();
    const [__, setLangChanged] = useState(0);
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
                    { !(['core', 'createqb', 'editqb'].includes(currentPage.get('p') || 'about')) &&
                        <>
                            <SidebarContainer />
                            <ChangeLangButton setLangChanged={setLangChanged} />
                            <ProfileMenuContainer setIsLoggedIn={setIsLoggedIn} />
                        </>
                    }
                </LoadingOverlay>
                : <LogIn setIsLoggedIn={setIsLoggedIn} /> 
            }
        </div>
    );
};


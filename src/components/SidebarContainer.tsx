import { useState } from 'react';
import { Sidebar } from './Sidebar';

export const SidebarContainer = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <button className='m-3 fixed z-50 top-0 left-0' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <img src={"/src/assets/nav.svg"} alt="nav" className='w-8 h-8' />
            </button>
            { isSidebarOpen &&
                <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
            }
        </>
    );
}


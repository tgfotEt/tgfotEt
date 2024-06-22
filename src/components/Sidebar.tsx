import { useSearchParams } from 'react-router-dom';
import * as ls from '../config/ls';

export const Sidebar = ({ setIsSidebarOpen  }) => {
    const userData = ls.getData().qb;
    const [_, setCurrentPage] = useSearchParams();
    return (
        <>
            <div className='fixed inset-0 bg-black bg-opacity-20 z-[45]' onClick={() => setIsSidebarOpen(false)}></div>
            <div className='fixed top-0 bottom-0 left-0 w-64 z-[47] bg-gray-900 pt-14 px-3 flex flex-col overflow-y-auto'>
                <button className='sidebar-btn' onClick={() => {setCurrentPage({p:'about'}); setIsSidebarOpen(false);}}>tgfotEt</button>
                <button className='sidebar-btn' onClick={() => {setCurrentPage({p:'qbank'}); setIsSidebarOpen(false);}}>Explore</button>
                <div className='w-full my-3'></div>
                {
                    Object.keys(userData).sort((a, b)=>userData[a].title.localeCompare(userData[b].title)).map(qbankId => (
                        <button key={qbankId} className='sidebar-btn' onClick={() => {setCurrentPage({p:'qbdetail', id:qbankId}); setIsSidebarOpen(false);}}>{userData[qbankId].title}</button>
                    ))
                }
            </div>
        </>
    );
}

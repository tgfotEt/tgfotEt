import * as ls from '../config/ls';
export const Sidebar = ({setCurrentPage, setIsSidebarOpen}) => {
    const userData = ls.getData().qb;
    return (
        <>
            <div className='absolute inset-0 bg-black bg-opacity-20 z-[45]' onClick={() => setIsSidebarOpen(false)}></div>
             <div className='absolute top-0 bottom-0 left-0 w-64 z-[47] bg-gray-900 pt-14 px-3 flex flex-col'>
                <button className='sidebar-btn' onClick={() => {setCurrentPage('about'); setIsSidebarOpen(false);}}>tgfotEt</button>
                <button className='sidebar-btn' onClick={() => {setCurrentPage('qbank'); setIsSidebarOpen(false);}}>Explore</button>
                <div className='w-full my-3'></div>
                {
                    Object.keys(userData).map(qbankId => (
                        <button key={qbankId} className='sidebar-btn' onClick={() => {setCurrentPage('qbdetail ' + qbankId); setIsSidebarOpen(false);}}>{userData[qbankId].title}</button>
                    ))
                }
            </div>
        </>
    );
}

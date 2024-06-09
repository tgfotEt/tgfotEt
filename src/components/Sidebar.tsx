export const Sidebar = ({setCurrentPage}) => {
    return (
        <div className='absolute top-0 bottom-0 left-0 w-1/6 bg-gray-900 pt-14 px-3'>
            <button onClick={() => setCurrentPage('about')}>tgfotEt</button>
            <button onClick={() => setCurrentPage('qbank')}>Explore</button>
        </div>
    );
}

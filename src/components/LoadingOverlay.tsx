import { useEffect, useState } from 'react';

export const LoadingOverlay = ({ func, state=true, children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        async function load() {
            try {
                await func();
            } catch (error) {
                setError(JSON.stringify(error));
            }
            setIsLoading(false);
        }
        if (state) load();
    }, [state]);
    return (
        <>
            { (isLoading && state)
                ? 
                <div className='fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center'>
                    <div className='bg-gray-700 p-6 rounded-lg'>
                        <h1 className='text-2xl'>Loading...</h1>
                    </div>
                </div>
                : error
                ? 
                <div className='fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center'>
                    <div className='bg-red-700 p-6 rounded-lg'>
                        <h1 className='text-2xl'>Error</h1>
                        <p>{error}</p>
                    </div>
                </div>
                : children
            }
        </>
    );
};


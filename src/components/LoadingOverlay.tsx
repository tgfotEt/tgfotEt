import { useEffect, useState } from 'react';

export const LoadingOverlay = ({ func, state=true, children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        async function load() {
            try {
                await func();
            } catch (error: any) {
                setError(error.message);
                console.error(error);
            }
            setTimeout(()=>setIsLoading(false), 10);
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
                        <button onClick={() => setError("")}>Close</button>
                    </div>
                </div>
                : children
            }
        </>
    );
};

export const ConfirmOverlay = ({ prompt, confirmText = 'OK', cancelText = 'Cancel', onConfirm, onCancel=()=>{}, state=true, alert=false }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <>
            { (isOpen && state)
                ? 
                <div className='fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center'>
                    <div className='bg-gray-700 p-6 rounded-lg'>
                        <h1 className='text-2xl'>{prompt}</h1>
                        <div className='flex gap-2'>
                            { !alert && <button onClick={() => { onCancel(); setIsOpen(false); }}>{cancelText}</button> }
                            <button onClick={() => { onConfirm(); setIsOpen(false); }}>{confirmText}</button>
                        </div>
                    </div>
                </div>
                : null
            }
        </>
    );
};

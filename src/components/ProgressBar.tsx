import { useEffect, useState } from 'react';
import { QuestionProgress } from '../config/types';
import * as ls from '../config/ls';
export const ProgressBar = ({ qBankId, solving }: { qBankId: string, solving: QuestionProgress }) => {
    const [percent, setPercent] = useState(0);
    useEffect(() => {
        setPercent((ls.getData().qb[qBankId].progress.reduce((a, b) => a + (b.hash === solving.hash ? 0 : b.solved), 0)+solving.solved) / ls.getData().qb[qBankId].progress.length * 100);
    }, [solving]);
    return (
        <div className='fixed inset-0 flex justify-center items-center z-[1]'>
            <div className='absolute w-1/2 bottom-0 py-4 bg-gray-700 flex justify-center items-center rounded-tr-lg rounded-tl-lg'>
                <div className='w-full mx-6 h-6 bg-[#8a9895] rounded-md overflow-hidden border-[1px] border-gray-500 shadow-lg'>
                    <div
                        className='h-full border-r-2 border-[#0f4f43] bg-[#00997d] transition-all duration-200 ease-in-out'
                        style={{ width: percent.toString() + '%' }}
                    ></div>
                    <div className='absolute top-0 px-2 py-4 text-md'> {percent.toFixed(2)}% </div>
                </div>
            </div>
        </div>
    );
};

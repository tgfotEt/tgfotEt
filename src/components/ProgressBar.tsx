import { useEffect, useState } from 'react';
import { QuestionProgress } from '../config/types';
import * as ls from '../config/ls';
export const ProgressBar = ({ qBankId, solving }: { qBankId: string, solving: QuestionProgress }) => {
    const [percent, setPercent] = useState(0);
    useEffect(() => {
        setPercent((ls.getData().qb[qBankId].progress.reduce((a, b) => a + (b.hash === solving.hash ? 0 : b.solved), 0)+solving.solved) / ls.getData().qb[qBankId].progress.length * 100);
    }, [solving]);
    return (
        <div className=' absolute left-0 right-0 bottom-4 flex justify-center align-middle'>
            <div className='w-3/5 h-6 bg-[#8a9895] rounded-md overflow-hidden border-[1px] border-gray-500 shadow-lg'>
                <div
                    className='h-full border-r-2 border-[#0f4f43] bg-[#00997d] transition-all duration-200 ease-in-out'
                    style={{ width: percent.toString() + '%' }}
                ></div>
                <div className='absolute top-0 px-3 text-lg'> {percent.toFixed(2)}% </div>
            </div>
        </div>
    );
};

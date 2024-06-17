import { orderBy } from 'firebase/firestore';
import { QBankList } from './QBankList';
export const QBankPage = () => {
    return (
        <div>
            <h1 className='text-3xl m-5'>Explore</h1>
            <div className='flex flex-col'>
                <div className='text-2xl mx-20 my-5 text-left'>Most Popular</div>
                <QBankList sortBy={ [orderBy('downloads', 'desc')] } />
            </div>
        </div>
    );
};

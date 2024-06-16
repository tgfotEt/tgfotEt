import { orderBy } from 'firebase/firestore';
import { QBankList } from './QBankList';
export const QBankPage = () => {
    return (
        <div>
            <h1 className='text-3xl'>Explore</h1>
            <QBankList sortBy={ [orderBy('downloads', 'desc')] } />
        </div>
    );
};

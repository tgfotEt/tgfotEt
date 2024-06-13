import { orderBy } from 'firebase/firestore';
import { QBankList } from './QBankList';
export const QBankPage = () => {
    return (
        <div>
            <h1>QBank</h1>
            <QBankList sortBy={ [orderBy('downloads', 'desc')] } />
        </div>
    );
};

import { useSearchParams } from 'react-router-dom';
import { where, orderBy } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { QBankList } from './QBankList';

export const UserQBankPage = () => {
    const user = auth.currentUser!;
    const [_, setCurrentPage] = useSearchParams();
    return (
        <div>
            <button onClick={() => setCurrentPage({p:'createqb'})}>Create your own Question Bank</button>
            <QBankList sortBy={[where('authorid', '==', user.uid), orderBy('updatedAt', 'desc')]} />
        </div>
    );
};

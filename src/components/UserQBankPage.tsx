import { useSearchParams } from 'react-router-dom';
import { where, orderBy } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { QBankList } from './QBankList';

export const UserQBankPage = () => {
    const user = auth.currentUser!;
    const [_, setCurrentPage] = useSearchParams();
    return (
        <div>
            <div className='text-3xl m-5'>Your Question Banks</div>
            <QBankList sortBy={[where('authorid', '==', user.uid), orderBy('updatedAt', 'desc')]} />
            <button className='rounded-md p-2 m-5 bg-gray-700 hover:bg-gray-600' onClick={() => setCurrentPage({p:'createqb'})}>Create your own Question Bank</button>
        </div>
    );
};

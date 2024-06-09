import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const UserQBankPage = ({ setCurrentPage }) => {
    const user = auth.currentUser!;
    const qbankRef = collection(db, 'qbank');
    const qbankQuery = query(qbankRef, where('authorid', '==', user.uid));
    const [userQBank, setUserQBank] = useState<DocumentData[]>([]);
    useEffect(() => {
        const getQBank = async () => {
            const qbankSnapshot = await getDocs(qbankQuery);
            const qbankData = qbankSnapshot.docs.map((doc) => doc.data());
            setUserQBank(qbankData);
        };
        getQBank();
    }, []);
    return (
        <div>
            <button onClick={() => setCurrentPage('createqb')}>Create your own Question Bank</button>
            <div>
                {userQBank.map((qbank, index) => (
                    <div key={index}>
                        <h2>{qbank.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

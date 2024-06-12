import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { LoadingOverlay } from './LoadingOverlay';

export const UserQBankPage = () => {
    const user = auth.currentUser!;
    const qbankRef = collection(db, 'qbank');
    const qbankQuery = query(qbankRef, where('authorid', '==', user.uid));
    const [userQBank, setUserQBank] = useState<[DocumentData, string][]>([]);
    const [_, setCurrentPage] = useSearchParams();
    const getQBank = async () => {
        const qbankSnapshot = await getDocs(qbankQuery); console.log("reading qbank data");
        const qbankData = qbankSnapshot.docs.map((doc) => ([doc.data(), doc.id] as [DocumentData, string]));
        setUserQBank(qbankData);
    };
    return (
        <div>
            <button onClick={() => setCurrentPage({p:'createqb'})}>Create your own Question Bank</button>
            <LoadingOverlay func={ getQBank }>
                {userQBank.map((qbank, index) => (
                    <div key={index}>
                        <button className='hover:bg-gray-700' onClick={() => setCurrentPage({p:'qbdetail', id: qbank[1]})}>
                            <h2>{qbank[0].title}</h2>
                            <p>{qbank[0].description}</p>
                        </button>
                    </div>
                ))}
            </LoadingOverlay>
        </div>
    );
};

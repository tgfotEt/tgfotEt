import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const UserQBankPage = ({ setCurrentPage }) => {
    const user = auth.currentUser!;
    const qbankRef = collection(db, 'qbank');
    const qbankQuery = query(qbankRef, where('authorid', '==', user.uid));
    const [userQBank, setUserQBank] = useState<[DocumentData, string][]>([]);
    useEffect(() => {
        const getQBank = async () => {
            const qbankSnapshot = await getDocs(qbankQuery); console.log("reading qbank data");
            const qbankData = qbankSnapshot.docs.map((doc) => ([doc.data(), doc.id] as [DocumentData, string]));
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
                        <button className='hover:bg-gray-700' onClick={() => setCurrentPage('editqb ' + qbank[1])}>
                            <h2>{qbank[0].title}</h2>
                            <p>{qbank[0].description}</p>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

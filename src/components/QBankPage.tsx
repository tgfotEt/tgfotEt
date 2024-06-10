import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../config/firebase';
import { QuestionBankMetaData } from '../config/types';
export const QBankPage = () => {
    const [qBankList, setQBankList] = useState<QuestionBankMetaData[]>([]);
    const [allLoaded, setAllLoaded] = useState(false);
    const getQBankList = async (lastVisible: null|QuestionBankMetaData) => {
        const lim = 10;
        try {
            const qBankRef = collection(db, 'qbank');
            const q = (lastVisible
                ? query(qBankRef, orderBy('downloads', 'desc'), orderBy('createdAt'), limit(lim), startAfter(lastVisible))
                : query(qBankRef, orderBy('downloads', 'desc'), orderBy('createdAt'), limit(lim)));
            const qBankSnapshot = await getDocs(q);
            const qBankData = qBankSnapshot.docs.map((doc) => doc.data() as QuestionBankMetaData);
            if (qBankData.length < lim) setAllLoaded(true);
            setQBankList(qBankList.concat(qBankData));
        } catch (error) {
            console.error(error);
            alert('Failed to fetch QBank list. Please try again later');
        }
    };
    useEffect(() => {
        getQBankList(null);
    }, []);
    return (
        <div>
            <h1>QBank</h1>
            {
                qBankList.map((qbank, index) => (
                    <div key={index}>
                        <h2>{qbank.title}</h2>
                        <p>{qbank.description}</p>
                    </div>
                ))
            }
            { qBankList.length !== 0 && !allLoaded && <button onClick={() => getQBankList(qBankList[qBankList.length - 1])}>Load More</button> }
        </div>
    );
}

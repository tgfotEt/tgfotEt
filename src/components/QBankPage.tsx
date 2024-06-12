import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../config/firebase';
import { QuestionBankMetaData } from '../config/types';
import { LoadingOverlay } from './LoadingOverlay';
export const QBankPage = () => {
    const [qBankList, setQBankList] = useState<[QuestionBankMetaData, string][]>([]);
    const [allLoaded, setAllLoaded] = useState(false);
    const [_, setCurrentPage] = useSearchParams();
    const getQBankList = async (lastVisible: null|QuestionBankMetaData = null) => {
        const lim = 10;
        const qBankRef = collection(db, 'qbank');
        const q = (lastVisible
            ? query(qBankRef, orderBy('downloads', 'desc'),  limit(lim), startAfter(lastVisible))
            : query(qBankRef, orderBy('downloads', 'desc'),  limit(lim)));
        const qBankSnapshot = await getDocs(q); console.log("reading qbank data");
        const qBankData = qBankSnapshot.docs.map((doc) => [doc.data(), doc.id] as [QuestionBankMetaData, string]);
        if (qBankData.length < lim) setAllLoaded(true);
        setQBankList(qBankList.concat(qBankData));
    };
    return (
        <div>
            <h1>QBank</h1>
            <LoadingOverlay func={getQBankList}>
                {
                    qBankList.map((qbank, index) => (
                        <div key={index}>
                            <button onClick={() => setCurrentPage({p:'qbdetail', id:qbank[1]})}>
                                <h2>{qbank[0].title}</h2>
                                <p>{qbank[0].description}</p>
                            </button>
                        </div>
                    ))
                }
                { qBankList.length !== 0 && !allLoaded && <button onClick={() => getQBankList(qBankList[qBankList.length - 1][0])}>Load More</button> }
            </LoadingOverlay>
        </div>
    );
}

import { useState } from "react";
import { getDocs, limit, startAfter, query, collection } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db } from "../config/firebase";
import { QuestionBankMetaData } from "../config/types";
import { LoadingOverlay } from "./LoadingOverlay";

export const QBankList = ({ sortBy }) => {
    const [qBankList, setQBankList] = useState<[QuestionBankMetaData, string][]>([]);
    const [allLoaded, setAllLoaded] = useState(false);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [_, setCurrentPage] = useSearchParams();
    
    const getQBankList = async () => {
        const lim = 10;
        const qBankRef = collection(db, 'qbank');
        const q = (lastVisible
            ? query(qBankRef, ...sortBy, limit(lim), startAfter(lastVisible))
            : query(qBankRef, ...sortBy, limit(lim)));
        console.log(q);
        const qBankSnapshot = await getDocs(q); console.log("reading qbank data");
        
        const lastDoc = qBankSnapshot.docs[qBankSnapshot.docs.length - 1];
        setLastVisible(lastDoc);

        const qBankData = qBankSnapshot.docs.map((doc) => [doc.data(), doc.id] as [QuestionBankMetaData, string]);
        if (qBankData.length < lim) setAllLoaded(true);
        setQBankList(qBankList.concat(qBankData));
    };

    return (
        <LoadingOverlay func={getQBankList}>
            <div className='flex flex-col mx-[10%] gap-2'>
                {
                    qBankList.map((qbank, index) => (
                        <button className='rounded-md bg-gray-700 p-2 flex flex-row text-left min-h-20 hover:bg-gray-600' key={index} onClick={() => setCurrentPage({ p: 'qbdetail', id: qbank[1] })}>
                            <h2 className='font-bold truncate w-1/3 text-lg'>{qbank[0].title}</h2>
                            <p className='line-clamp-2 w-2/3 italic text-gray-400'>{qbank[0].description}</p>
                        </button>
                    ))
                }
                {qBankList.length !== 0 && !allLoaded &&
                    <button onClick={getQBankList}>Load More</button>
                }
                { qBankList.length === 0 &&
                    <div className='text-gray-400'>No Question Banks found</div>
                }
            </div>
        </LoadingOverlay>
    );
};


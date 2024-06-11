import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { QuestionBankMetaData } from '../config/types';
import * as ls from '../config/ls';

export const QBankDetailsPage = ({ setCurrentPage, qBankId }) => {
    const [qBankMetaData, setQBankMetaData] = useState<QuestionBankMetaData|null>(null);
    const downloadQBank = async () => {
        try {
            ls.downloadQBank(qBankId, auth.currentUser!.uid);
        } catch (error) {
            console.warn(error);
            alert('Failed to download. Please try again later');
        }
        setCurrentPage('qbank');
    };

    const removeQBank = async () => {
        try {
            await ls.removeSyncQBank(qBankId, auth.currentUser!.uid);
        } catch (error) {
            console.warn(error);
            alert('Failed to delete. Please try again later');
        }
        setCurrentPage('qbank');
    }

    useEffect(() => {
        const getQBankMetaData = async () => {
            try {
                const qBankDoc = doc(db, 'qbank', qBankId);
                const snapshot = await getDoc(qBankDoc); console.log("reading qbank data");
                if (!snapshot.exists()) {
                    alert('Document does not exist, removing from saved');
                    ls.removeQBank(qBankId);
                    setCurrentPage('qbank');
                    return;
                }
                setQBankMetaData(snapshot.data() as QuestionBankMetaData);
            } catch (error) {
                console.warn(error);
                alert('Failed to fetch data. Please try again later');
                setCurrentPage('qbank');
            }
        }
        getQBankMetaData();
    }, []);

    return (
        <div className='py-20 flex flex-row gap-2 justify-center align-middle h-full'>
            { qBankMetaData ?
                <> 
                    <div className='grid [grid-template-rows:auto_auto_auto_auto_1fr] gap-2 [&>*]:bg-gray-700 [&>*]:py-2 [&>*]:rounded-md align-middle w-1/2'>
                        <div className='text-3xl py-4'>{qBankMetaData.title}</div>
                        <div>By: {qBankMetaData.authorname}</div>
                        <div>Created on {qBankMetaData.createdAt.toDate().toDateString()}</div>
                        <div>Last updated on {qBankMetaData.updatedAt.toDate().toDateString()}</div>
                        <div>{qBankMetaData.description}</div>
                    </div>
                    <div className='grid gap-2 [&>*]:bg-gray-700 align-middle w-1/5 [&>*]:w-full [&>*]:rounded-md'>
                        { Object.keys(ls.getData().qb).includes(qBankId) 
                            ? <button onClick={removeQBank}>Remove from Saved</button>
                            : <button onClick={downloadQBank}>Add to Saved</button>
                        }
                        { auth.currentUser!.uid === qBankMetaData.authorid && 
                            <button onClick={() => setCurrentPage('editqb ' + qBankId)}>Edit</button>
                        }
                        <button onClick={() => setCurrentPage('qbank')}>Back</button>
                    </div>
                </>
                : <div>Loading...</div>
            }
        </div>
    );
};

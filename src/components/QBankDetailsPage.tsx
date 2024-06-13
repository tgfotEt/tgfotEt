import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { QuestionBankMetaData } from '../config/types';
import { LoadingOverlay } from './LoadingOverlay';
import * as ls from '../config/ls';

export const QBankDetailsPage = ({ qBankId }) => {
    const [qBankMetaData, setQBankMetaData] = useState<QuestionBankMetaData>();
    const [isLoading, setIsLoading] = useState(false);
    const [_, setCurrentPage] = useSearchParams();
    const startedUsing = ls.hasQBank(qBankId) && ls.getData().qb[qBankId].progress.length !== 0;

    const downloadQBank = async () => {
        await ls.downloadSyncQBank(qBankId);
        setIsLoading(false);
    };

    const removeQBank = async () => {
        await ls.removeSyncQBank(qBankId);
        setIsLoading(false);
    };

    const getQBankMetaData = async () => {
        const qBankDoc = doc(db, 'qbank', qBankId);
        const snapshot = await getDoc(qBankDoc); console.log("reading qbank data");
        if (!snapshot.exists()) {
            await ls.removeSyncQBank(qBankId);
            throw new Error('Document does not exist, removing from saved');
        }
        setQBankMetaData(snapshot.data() as QuestionBankMetaData);
        if(ls.hasQBank(qBankId) && ls.getTitle(qBankId) !== snapshot.data().title) {
            await ls.setTitle(qBankId, snapshot.data().title);
        }
    }

    return (
        <div className='py-20 flex flex-row gap-2 justify-center align-middle h-full'>
            <LoadingOverlay func={ getQBankMetaData } > 
                { qBankMetaData &&
                    <>
                        <div className='grid [grid-template-rows:auto_auto_auto_auto_1fr] gap-2 [&>div]:bg-gray-700 [&>div]:py-2 [&>div]:rounded-md align-middle w-1/2'>
                            <div className='text-3xl py-4'>{qBankMetaData.title}</div>
                            <div>By: {qBankMetaData.authorname}</div>
                            <div>Created on {qBankMetaData.createdAt.toDate().toDateString()}</div>
                            <div>Last updated on {qBankMetaData.updatedAt.toDate().toDateString()}</div>
                            <div>{qBankMetaData.description}</div>
                        </div>
                        <div className='grid gap-2 [&>button]:bg-gray-700 align-middle w-1/5 [&>button]:w-full [&>button]:rounded-md'>
                            { ls.hasQBank(qBankId)
                                ? (
                                    <>
                                        { startedUsing 
                                            ? (
                                                <>
                                                    <button>Continue</button>
                                                    <button>Restart</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button>Start</button>
                                                </>
                                            )
                                        }
                                        <button onClick={() => setIsLoading(true)}>Remove from Saved</button>
                                        <LoadingOverlay func={removeQBank} state={isLoading}> </LoadingOverlay>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setIsLoading(true)}>Add to Saved</button>
                                        <LoadingOverlay func={downloadQBank} state={isLoading}> </LoadingOverlay>
                                    </>
                                )
                            }
                            { auth.currentUser!.uid === qBankMetaData.authorid && 
                                <button onClick={() => setCurrentPage({p:'editqb',id:qBankId})}>Edit</button>
                            }
                            <button onClick={() => setCurrentPage({p:'qbank'})}>Back</button>
                        </div>
                    </>
                }
            </LoadingOverlay>
        </div>
    );
};

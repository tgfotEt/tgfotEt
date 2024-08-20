import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';
import { QuestionBankMetaData } from '../config/types';
import { LoadingOverlay, ConfirmOverlay } from './LoadingOverlay';
import * as ls from '../config/ls';
import { printLang } from '../config/lang';

export const QBankDetailsPage = ({ qBankId }) => {
    const [qBankMetaData, setQBankMetaData] = useState<QuestionBankMetaData>();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmRestart, setConfirmRestart] = useState(false);
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

    const setCorePage = () => {
        setCurrentPage({p:'core', id:qBankId});
    }

    const restartQBank = async () => {
        await ls.restartQBank(qBankId);
        console.log('restarting');
        setCorePage();
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

    const exportQBank = async () => {
        const url = await getDownloadURL(ref(storage, `qbank/${qBankId}`));
        const a = document.createElement('a');
        a.href = url;
        a.download = qBankMetaData!.title + '.json';
        a.click();
    };

    return (
        <div className='py-20 flex flex-row gap-2 justify-center align-middle h-full'>
            <LoadingOverlay func={ getQBankMetaData } > 
                { qBankMetaData &&
                    <>
                        <div className='grid [grid-template-rows:auto_auto_auto_auto_1fr] gap-2 [&>div]:bg-gray-700 [&>div]:py-2 [&>div]:rounded-md align-middle w-1/2'>
                            <div className='text-3xl py-4'>{qBankMetaData.title}</div>
                            <div>{printLang('by')}{qBankMetaData.authorname}</div>
                            <div>{printLang('created_on')}{qBankMetaData.createdAt.toDate().toDateString()}</div>
                            <div>{printLang('last_updated_on')}{qBankMetaData.updatedAt.toDate().toDateString()}</div>
                            <div>{qBankMetaData.description}</div>
                        </div>
                        <div className='grid gap-2 [&>button]:bg-gray-700 align-middle w-1/5 [&>button]:w-full [&>button]:rounded-md'>
                            { ls.hasQBank(qBankId)
                                ? (
                                    <>
                                        { startedUsing 
                                            ? (
                                                <>
                                                    { !ls.getData().qb[qBankId].progress.every((p) => p.solved === 1) &&
                                                        <button onClick={setCorePage}>{printLang('continue')}</button>
                                                    }
                                                    <button onClick={() => setConfirmRestart(true)}>{printLang('restart')}</button>
                                                    <ConfirmOverlay
                                                        prompt={printLang('confirm_restart')}
                                                        onConfirm={ restartQBank }
                                                        state={confirmRestart}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={setCorePage}>{printLang('start')}</button>
                                                </>
                                            )
                                        }
                                        <button onClick={() => setIsLoading(true)}>{printLang('remove_from_saved')}</button>
                                        <LoadingOverlay func={removeQBank} state={isLoading}> </LoadingOverlay>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setIsLoading(true)}>{printLang('add_to_saved')}</button>
                                        <LoadingOverlay func={downloadQBank} state={isLoading}> </LoadingOverlay>
                                    </>
                                )
                            }
                            { auth.currentUser!.uid === qBankMetaData.authorid && 
                                <button onClick={() => setCurrentPage({p:'editqb',id:qBankId})}>{printLang('edit')}</button>
                            }
                            <button onClick={exportQBank}>{printLang('export_json')}</button>
                            <button onClick={() => setCurrentPage({p:'qbank'})}>{printLang('back')}</button>
                        </div>
                    </>
                }
            </LoadingOverlay>
        </div>
    );
};

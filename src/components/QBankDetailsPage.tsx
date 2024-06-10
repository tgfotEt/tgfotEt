import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { QuestionBankMetaData } from '../config/types';
import * as ls from '../config/ls';

export const QBankDetailsPage = ({ setCurrentPage, qBankId }) => {
    const [qBankMetaData, setQBankMetaData] = useState<QuestionBankMetaData|null>(null);
    const downloadQBank = async () => {
        try {
            const qBankDoc = doc(db, 'qbank', qBankId);
            const snapshot = await getDoc(qBankDoc); console.log("reading qbank data");
            if (!snapshot.exists()) throw new Error('Document does not exist');
            const qBankMetaData = snapshot.data() as QuestionBankMetaData;
            await updateDoc(qBankDoc, { downloads: qBankMetaData.downloads + 1 });
            const updateData = ls.getData();
            updateData.qb[qBankId] = {
                title: qBankMetaData.title,
                progress: []
            };
            await ls.setSyncData(auth.currentUser!.uid, updateData);
        } catch (error) {
            console.warn(error);
            alert('Failed to download. Please try again later');
        }
        setCurrentPage('qbank');
    };

    useEffect(() => {
        const getQBankMetaData = async () => {
            try {
                const qBankDoc = doc(db, 'qbank', qBankId);
                const snapshot = await getDoc(qBankDoc); console.log("reading qbank data");
                if (!snapshot.exists()) throw new Error('Document does not exist');
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
        <div>
            <button onClick={() => setCurrentPage('qbank')}>Back</button>
            { qBankMetaData ?
                <>
                    <h1>{qBankMetaData.title}</h1>
                    <p>{qBankMetaData.description}</p>
                    <p>By: {qBankMetaData.authorname}</p>
                    <p>Created on {qBankMetaData.createdAt.toDate().toDateString()}</p>
                    <p>Last updated on {qBankMetaData.updatedAt.toDate().toDateString()}</p>
                    <button onClick={downloadQBank}>Download</button>
                </>
                : <p>Loading...</p>
            }
        </div>
    );
};

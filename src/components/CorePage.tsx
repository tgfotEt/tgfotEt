import { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { useSearchParams } from 'react-router-dom';
import { storage } from '../config/firebase';
import { LoadingOverlay } from './LoadingOverlay';
import * as ls from '../config/ls';
import hash from 'object-hash';
import { QuestionBank, QuestionProgress } from '../config/types';

export const CorePage = () => {
    const [currentPage, setCurrentPage] = useSearchParams();
    const qBankId = currentPage.get('id')!;
    const [solved, setSolved] = useState<QuestionProgress|null>(null);
    const [submitted, setSubmitted] = useState(false);

    const nextQuestion = () => {
        setSubmitted(false);
        const progress = ls.getData().qb[qBankId].progress;
        const available = progress.filter((q) => q.solved < 1);
        if (available.length === 0) {
            setCurrentPage({p:'qbdetail', id: qBankId});
            return;
        }
        const minCount = Math.min(...available.map((q) => q.count));
        const availableMin = available.filter((q) => q.count === minCount);
        const nextQ = availableMin[Math.floor(Math.random() * availableMin.length)];
        setSolved(nextQ);
    };

    useEffect(() => {
        if (!submitted || !solved) return;
        console.log('submitted');
        ls.updateProgress(qBankId, solved.hash, solved.solved, solved.individualProgress);
        nextQuestion();
    }, [submitted]);

    const getFile = async () => {
        const storageRef = ref(storage, 'qbank/' + qBankId);
        const file = await getDownloadURL(storageRef);
        const response = await fetch(file);
        const data = await response.text();
        return JSON.parse(data) as QuestionBank;
    };

    const syncQBank = async (file: QuestionBank) => {
        if (ls.getData().qb[qBankId].progress.length === 0) {
            await ls.initProgressAll(qBankId, file.questions);
            return;
        }
        const qbHashes = Object.keys(file).map((key) => [hash(file[key]), key]);
        const userHashes = ls.getData().qb[qBankId].progress;
        const newUserHashes: QuestionProgress[] = [];
        qbHashes.sort();
        userHashes.sort();
        let i = 0, j = 0;
        while (i < qbHashes.length && j < userHashes.length) {
            if (qbHashes[i][0] === userHashes[j].hash) {
                newUserHashes.push(userHashes[j]);
                i++;
                j++;
            } else if (qbHashes[i][0] < userHashes[j].hash) {
                newUserHashes.push(ls.initProgress(file[qbHashes[i][1]]));
                i++;
            } else {
                j++;
            }
        }
        while (i < qbHashes.length) {
            newUserHashes.push(ls.initProgress(file[qbHashes[i][1]]));
            i++;
        }
        await ls.setProgress(qBankId, newUserHashes);
    };

    const loadQBank = async () => {
        const file = await getFile();
        await syncQBank(file);
        nextQuestion();
    };

    const saveAndQuit = async () => {
        await ls.syncData();
        setCurrentPage({p:'qbdetail', id: qBankId});
    };

    return (
        <div>
            <LoadingOverlay func={loadQBank}>
                <button onClick={saveAndQuit}>Save and Quit</button>
                <div>{qBankId}</div>
            </LoadingOverlay>
        </div>
    );
};

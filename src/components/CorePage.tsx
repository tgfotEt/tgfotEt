import { useState, useEffect } from 'react';
import { ref, getBytes } from 'firebase/storage';
import { useSearchParams } from 'react-router-dom';
import { storage } from '../config/firebase';
import { LoadingOverlay } from './LoadingOverlay';
import * as ls from '../config/ls';
import hash from 'object-hash';
import { QuestionBank, QuestionProgress, Question, FillIn, isFillIn, Combined, Mixed } from '../config/types';
import { FillInContainer } from './FillInContainer';
import { ProgressBar } from './ProgressBar';
import { MixedContainer } from './MixedContainer';
export const CorePage = () => {
    const [currentPage, setCurrentPage] = useSearchParams();
    const qBankId = currentPage.get('id')!;
    const [solving, setSolving] = useState<QuestionProgress|null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [file, setFile] = useState<[string, Question][]|null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question|null>(null);
    const [questionId, setQuestionId] = useState(0);
    const nextQuestion = (data = file) => {
        if(!data) return;
        setSubmitted(false);
        const progress = ls.getData().qb[qBankId].progress;
        const available = progress.filter((q) => q.solved < 1);
        if (available.length === 0) {
            saveAndQuit();
            return;
        }
        const minCount = Math.min(...available.map((q) => q.count));
        const availableMin = available.filter((q) => q.count === minCount);
        const nextQ = availableMin[Math.floor(Math.random() * availableMin.length)];
        setSolving(nextQ);
        setCurrentQuestion(data!.find((q) => q[0] === nextQ.hash)![1]);
        setQuestionId(questionId + 1);
    };

    useEffect(() => {
        if (!submitted || !solving) return;
        ls.updateProgress(qBankId, solving.hash, solving.solved, solving.individualProgress);
        nextQuestion();
    }, [submitted]);

    const getFile = async () => {
        const storageRef = ref(storage, 'qbank/' + qBankId);
        const file = await getBytes(storageRef).then((data) => JSON.parse(new TextDecoder().decode(data)));
        return file as QuestionBank;
    };

    const syncQBank = async (qs: Question[]) => {
        if (ls.getData().qb[qBankId].progress.length === 0) {
            await ls.initProgressAll(qBankId, qs);
        }
        const qbHashes = qs.map((q) => [hash(q), q] as [string, Question]);
        const userHashes = ls.getData().qb[qBankId].progress;
        const newUserHashes: QuestionProgress[] = [];
        qbHashes.sort();
        userHashes.sort();
        setFile(qbHashes);
        let i = 0, j = 0;
        while (i < qbHashes.length && j < userHashes.length) {
            if (qbHashes[i][0] === userHashes[j].hash) {
                newUserHashes.push(userHashes[j]);
                i++;
                j++;
            } else if (qbHashes[i][0] < userHashes[j].hash) {
                newUserHashes.push(ls.initProgress(qbHashes[i][1]));
                i++;
            } else {
                j++;
            }
        }
        while (i < qbHashes.length) {
            newUserHashes.push(ls.initProgress(qbHashes[i][1]));
            i++;
        }
        await ls.setProgress(qBankId, newUserHashes);
        return qbHashes;
    };

    const loadQBank = async () => {
        const file = await getFile();
        const data = await syncQBank(file.questions);
        nextQuestion(data);
        console.log(currentQuestion);
    };

    const saveAndQuit = async () => {
        await ls.syncData();
        setCurrentPage({p:'qbdetail', id: qBankId});
    };

    return (
        <div className='absolute inset-0'>
            <LoadingOverlay func={loadQBank}>
                { currentQuestion && 
                    <>
                        <ProgressBar qBankId={qBankId} solving={solving!} />
                        { isFillIn(currentQuestion)
                            ? <FillInContainer key={`${questionId}`} solving={solving!} setSolving={setSolving} setSubmitted={setSubmitted} questionData={currentQuestion as FillIn} />
                            : <MixedContainer key={`${questionId}`} setSolving={setSolving} setSubmitted={setSubmitted} questionData={currentQuestion as Combined|Mixed} />
                        }
                    </>
                }
                <button onClick={saveAndQuit} className='m-5 p-3 rounded-md bg-gray-700 z-10 relative'>Save and Quit</button>
            </LoadingOverlay>
        </div>
    );
};

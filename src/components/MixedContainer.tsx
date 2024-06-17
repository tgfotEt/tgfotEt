import { useState, useEffect } from 'react';
import { QuestionProgress, FRQ, MCQ, Mixed, Translate, toMixed, isMCQ, isFRQ, isTranslate } from '../config/types';
import { MCQContainer } from './MCQContainer';
import { FRQContainer } from './FRQContainer';
import { TranslateContainer } from './TranslateContainer';
export const MixedContainer = ({ setSolving, setSubmitted, questionData }: { setSolving:any, setSubmitted:any, questionData: MCQ | FRQ | Translate | Mixed }) => {
    const [mixed, setMixed] = useState<Mixed | null>(null);
    const [subSubmitted, setSubSubmitted] = useState(false);
    const [currentSub, setCurrentSub] = useState(0);
    const [active, setActive] = useState<boolean[]>([]);
    const [subSolved, setSubSolved] = useState(0);
    const [finished, setFinished] = useState(false);
    const init = () => {
        const mxd=toMixed(questionData);
        setMixed(mxd);
        const actv = Array(mxd.subquestions.length).fill(false);
        actv[0] = true;
        setActive(actv);
    };

    useEffect(() => {
        if (!questionData) return;
        init();
    }, [questionData]);

    useEffect(() => {
        if (!subSubmitted || !mixed) return;
        setSubSubmitted(false);
        setSolving((prev: QuestionProgress) => {
            const newInd = [...prev.individualProgress];
            newInd[currentSub] = subSolved;
            const newSolved = newInd.reduce((acc, val) => acc + val, 0)/newInd.length;
            return { ...prev, individualProgress: newInd, solved: newSolved };
        });
        const actv = Array(mixed.subquestions.length).fill(false);
        if (currentSub === mixed.subquestions.length-1){
            setFinished(true);
        } else actv[currentSub + 1] = true;
        setActive(actv);
        setCurrentSub(currentSub + 1);
    }, [subSubmitted]);

    const onSubmit = () => {
        setFinished(false);
        setSubmitted(true);
    };

    return (
        <>
            { mixed && (
                <div className='absolute inset-0 z-[2]'>
                    <div className='absolute inset-0 flex justify-center top-24'>
                        <div className='bg-gray-700 flex flex-row rounded-2xl p-5 gap-5 w-5/6 h-2/3'>
                            <div className='w-1/3 text-left'>{mixed.prompt}</div>
                            <div className='rounded-lg bg-gray-800 p-5 w-2/3 overflow-y-auto'>
                                {mixed.subquestions.map((subquestion, i) => {
                                    if (isMCQ(subquestion)) {
                                        return <MCQContainer key={i} active={active[i]} setSolved={setSubSolved} setSubmitted={setSubSubmitted} questionData={subquestion as MCQ} />;
                                    } else if (isFRQ(subquestion)) {
                                        return <FRQContainer key={i} active={active[i]} setSolved={setSubSolved} setSubmitted={setSubSubmitted} questionData={subquestion as FRQ} />;
                                    } else if (isTranslate(subquestion)) {
                                        return <TranslateContainer key={i} active={active[i]} setSolved={setSubSolved} setSubmitted={setSubSubmitted} questionData={subquestion as Translate} />;
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <button onClick={onSubmit} hidden={!finished} className='absolute top-3/4 left-1/2 -translate-x-1/2 bg-gray-700 rounded-md px-3 py-1'>Next</button>
                </div>
            )}
        </>
    );
};

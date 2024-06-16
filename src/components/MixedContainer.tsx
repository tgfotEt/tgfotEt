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
        if (currentSub === mixed.subquestions.length-1){
            setSubmitted(true);
            return;
        }
        const actv = Array(mixed.subquestions.length).fill(false);
        actv[currentSub + 1] = true;
        setActive(actv);
        setCurrentSub(currentSub + 1);
    }, [subSubmitted]);

    return (
        <div>
            { mixed && (
                <>
                    <div>{mixed.prompt}</div>
                    <div>
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
                </>
            )}
        </div>
    );
};

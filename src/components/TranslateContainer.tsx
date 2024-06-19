import { useState, useRef } from 'react';
import { Translate } from '../config/types';
type TranslateMetaData = { type: string, char: string, newChar?: string };
type TranslateDistance = { distance: number, sequence: TranslateMetaData[] };
export const TranslateContainer = ({ active, setSolved, setSubmitted, questionData }: { active: boolean, setSolved: any, setSubmitted: any, questionData: Translate }) => {
    const [targetSubmitted, setTargetSubmitted] = useState(false);
    const [distance, setDistance] = useState<TranslateDistance|null>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const submit = () => {
        const value = textArea.current!.value;
        const dist = editDistance(value, questionData.target);
        const all = Math.max(questionData.target.split(' ').length, value.split(' ').length);
        setDistance(dist);
        setSolved((all - dist.distance) / all);
        setTargetSubmitted(true);
    };

    const editDistance = (str: string, str0: string) => {
        const str1 = str.split(' ');
        const str2 = str0.split(' ');
        const n = str1.length;
        const m = str2.length;
        const dp = Array(n + 1).fill([]).map(() => Array(m + 1).fill(0));
        const ops = Array(n + 1).fill([]).map(() => Array(m + 1).fill(''));
        for (let i = 0; i <= n; i++) {
            dp[i][0] = i;
            ops[i][0] = i > 0 ? 'd' : '';
        }
        for (let j = 0; j <= m; j++) {
            dp[0][j] = j;
            ops[0][j] = j > 0 ? 'i' : '';
        }
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                    ops[i][j] = 'm';
                }
                else {
                    const deleteCost = dp[i - 1][j] + 1;
                    const insertCost = dp[i][j - 1] + 1;
                    const substituteCost = dp[i - 1][j - 1] + 1;
                    const minCost = Math.min(deleteCost, insertCost, substituteCost);
                    dp[i][j] = minCost;
                    if (minCost === deleteCost) ops[i][j] = 'd';
                    else if (minCost === insertCost) ops[i][j] = 'i';
                    else ops[i][j] = 's';
                }
            }
        }
        const sequence: TranslateMetaData[] = [];
        let i = n, j = m;
        while (i > 0 || j > 0) {
            if (ops[i][j] === 'm') sequence.push({ type: 'm', char: str1[--i] }), j--;
            else if (ops[i][j] === 'd') sequence.push({ type: 'd', char: str1[--i] });
            else if (ops[i][j] === 'i') sequence.push({ type: 'i', char: str2[--j] });
            else sequence.push({ type: 's', char: str1[--i], newChar: str2[--j] });
        }
        return { distance: dp[n][m], sequence: sequence.reverse() };
    }
    const checkOps = (op: TranslateMetaData) => {
        if(op.type === 'm') return <span>{op.char}</span>;
        else if(op.type === 'd') return <s>{op.char}</s>;
        else if(op.type === 'i') return <span className='text-orange-400'>{op.char}</span>;
        if(op.char !== '') return <><span><span className='text-orange-400'>{op.newChar}</span><br/><s>{op.char}</s></span></>;
        return <span className='text-orange-400'>{op.newChar}</span>;
    }
    return (
        <div className='h-full'>
            { questionData.source }
            { !targetSubmitted
                ?
                <>
                    <textarea className='block bg-gray-700 rounded-md p-2 text-left resize-none w-full h-1/2 outline-none' ref={ textArea } disabled={!active} placeholder='Type your translation here'></textarea>
                    <div className='flex justify-end'>
                        <button disabled={!active} onClick={submit} className='bg-gray-700 rounded-md py-2 px-4 w-fit my-3'>Submit</button>
                    </div>
                </>
                :
                <>
                    <div className='bg-gray-700 rounded-md p-2 text-left'>
                        <div className='[&_*]:inline-block [&_s]:text-[rgb(207,168,255)]'>
                            {
                                distance && distance.sequence.map((op: TranslateMetaData, i) => {
                                    return <span key={i}>{checkOps(op)}&nbsp;</span>;
                                })
                            }
                        </div>
                    </div>
                    <div className='flex flex-row justify-end'>
                    <button onClick={() => setTargetSubmitted(false)} className='bg-gray-700 rounded-md py-2 px-4 w-fit m-3'>Try again</button>
                    <button onClick={() => {setSubmitted(true); setTargetSubmitted(false);}} className='bg-gray-700 rounded-md py-2 px-4 w-fit my-3'>Next</button>
                    </div>
                </>
            }
        </div>
    );
};

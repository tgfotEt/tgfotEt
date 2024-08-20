import { useState, useRef } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { FillIn, Question, Translate, MCQ, Mixed, isMCQ, isFillIn, isTranslate, MCQtemplate, MCMQtemplate, FRQtemplate, TranslateTemplate, FillIntemplate, MixedTemplate, Combined, isFRQ } from '../config/types';
type QuestionEditProps = {
    qVal: Question;
    setQVal: any;
    deleteQ: () => void;
    inMixed?: boolean;
};
export const QuestionEdit = ({ qVal, setQVal, deleteQ, inMixed=false }: QuestionEditProps) => {
    const [active, setActive] = useState(false);
    const selectRef = useRef<HTMLSelectElement>(null);
    const changeSelected = () => {
        switch (selectRef.current?.value) {
            case 'mcq':
                setQVal(MCQtemplate);
                break;
            case 'mcmq':
                setQVal(MCMQtemplate);
                break;
            case 'frq':
                setQVal(FRQtemplate);
                break;
            case 'translate':
                setQVal(TranslateTemplate);
                break;
            case 'fillin':
                setQVal(FillIntemplate);
                break;
            case 'mixed':
                setQVal(MixedTemplate);
                break;
            default:
                break;
        }
    };
    const changeAnswer = (index: number) => {
        const q = qVal as MCQ;
        if (typeof q.answer === 'number') {
            setQVal({ ...q, answer: index });
        } else {
            const answers = q.answer as number[];
            if (answers.includes(index)) {
                setQVal({ ...q, answer: answers.filter((a) => a !== index) });
            } else {
                setQVal({ ...q, answer: answers.concat(index) });
            }
        }
    };
    const hasAnswer = (q: MCQ, i: number) => {
        return typeof q.answer === 'number' ? q.answer === i : (q.answer as number[]).includes(i);
    }
    const openImage = () => {
        if (!(qVal as MCQ).img) return;
        const storageRef = ref(storage, 'images/' + (qVal as MCQ).img);
        getDownloadURL(storageRef).then((url) => {
            window.open(url, '_blank');
        });
    }
    return (
        <div className='bg-gray-700 rounded-md m-2'>
            <button className='rounded-md p-2 w-full bg-[#494949] hover:bg-gray-600 text-left' onClick={() => setActive((p: boolean) => !p)}>
                <span className='text-left'>
                    {
                        selectRef.current?.value
                    }
                </span>
                :&nbsp;
                <span>
                    {
                        (qVal as MCQ).question || (qVal as Mixed).prompt || (qVal as Translate).target || (qVal as FillIn).sentence || 'Question'
                    }
                </span>
            </button>
            <div className={`w-full grid transition-[grid-template-rows] duration-300 ease-in-out ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className='p-2 flex flex-col gap-2 justify-start'>
                        <select
                            ref={selectRef}
                            className='rounded-md p-2 bg-gray-600 w-fit outline-none'
                            onChange={changeSelected}
                            defaultValue={
                                isMCQ(qVal) ? (typeof (qVal as MCQ).answer === 'number' ? 'mcq' : 'mcmq') : 
                                isFRQ(qVal) ? 'frq' :
                                isTranslate(qVal) ? 'translate' : 
                                isFillIn(qVal) ? 'fillin' : 
                                'mixed'
                            }
                        >
                            <option value='mcq'>MCQ</option>
                            <option value='mcmq'>MCMQ</option>
                            <option value='frq'>FRQ</option>
                            <option value='translate'>Translate</option>
                            <option value='fillin'>Fill In</option>
                            { !inMixed && <option value='mixed'>Mixed</option> }
                        </select>
                        <button className='rounded-md p-2 bg-gray-600 hover:bg-gray-500 w-fit' onClick={deleteQ}>Delete</button>
                        {
                            Object.keys(qVal).map((key, index) => (
                                <div key={index}>
                                    { (key !== 'answer' || !isMCQ(qVal)) &&
                                        <div className='text-left'>
                                            <div className='p-2'>{key}</div>
                                            { 
                                                key === 'img'
                                                    ?
                                                    <button onClick={openImage} className='rounded-md p-2 bg-gray-600 hover:bg-gray-500'>View</button>
                                                    :
                                                typeof qVal[key] === 'string'
                                                    ? 
                                                    <textarea 
                                                        rows={5}
                                                        className='rounded-md p-2 bg-gray-600 outline-none w-full resize-y' 
                                                        onChange={(e) => setQVal({...qVal, [key]: e.target.value})}
                                                        value={qVal[key] || ''}
                                                    />
                                                    : 
                                                    key === 'choices'
                                                        ?
                                                        (
                                                            <div className='flex flex-col gap-2'>
                                                                {(qVal as MCQ).choices.map((choice, i) => (
                                                                    <div key={`${index}-${i}`} className='flex flex-row gap-2'>
                                                                        <button className='rounded-md p-2 bg-gray-600 hover:bg-gray-500' onClick={() => changeAnswer(i)}>
                                                                            {
                                                                                hasAnswer(qVal as MCQ, i) ? '-' : '+'
                                                                            }
                                                                        </button>
                                                                        <input 
                                                                            className={`rounded-md p-2 bg-gray-600 outline-none w-full ${hasAnswer(qVal as MCQ, i) ? 'bg-green-800' : 'bg-gray-600'}`}
                                                                            onChange={(e) => setQVal({...qVal, choices: (qVal as MCQ).choices.map((c, j) => j === i ? e.target.value : c)})}
                                                                            value={choice}
                                                                        />
                                                                        <button className='rounded-md p-2 bg-gray-600 hover:bg-gray-500' onClick={() => setQVal({...qVal, choices: (qVal as MCQ).choices.filter((_, j) => j !== i)})}>Delete</button>
                                                                    </div>
                                                                ))}
                                                                <button className='rounded-md p-2 bg-gray-600 hover:bg-gray-500' onClick={() => setQVal({...qVal, choices: (qVal as MCQ).choices.concat('')})}>Add Choice</button>
                                                            </div>
                                                        )
                                                        : 
                                                        key === 'subquestions'
                                                            ?
                                                            (
                                                                <div className='bg-[#252525] rounded-md p-1'>
                                                                    {
                                                                        (qVal as Mixed).subquestions.map((q: Combined, i: number) => (
                                                                            <QuestionEdit
                                                                                key={i}
                                                                                qVal={q}
                                                                                deleteQ={() => setQVal({...qVal, subquestions: (qVal as Mixed).subquestions.filter((_, j) => j !== i)})}
                                                                                setQVal={(val: any) => setQVal({...qVal, subquestions: (qVal as Mixed).subquestions.map((q, j) => j === i ? val : q)})}
                                                                                inMixed
                                                                            />
                                                                        ))
                                                                    }
                                                                    <button className='rounded-md p-2 bg-gray-600 hover:bg-gray-500' onClick={() => setQVal({...qVal, subquestions: (qVal as Mixed).subquestions.concat(MCQtemplate)})}>Add Question</button>
                                                                </div>
                                                            )
                                                            :
                                                            (<></>)
                                            }
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

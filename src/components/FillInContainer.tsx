import { useState, useEffect, useRef } from 'react';
import { FillIn, QuestionProgress } from '../config/types';
import { shuffle } from '../config/utils';
const exceptions = ['', 'a', 'an', 'the', 'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'you\'re', 'i\'m', 'his', 'him', 'her', 'our', 'their', 'me', 'hers', 'them', 'us', 'and', 'too', 'do', 'doing', 'does', 'done', 'don\'t', 'doesn\'t', 'say', 'said', 'says', 'but', 'not', 'yes', 'no', 'can', 'can\'t', 'will', 'won\'t', 'or', 'what', 'all', 'go', 'goes', 'going', 'went', 'gone', 'so', 'this', 'these', 'those', 'have', 'has', 'had', 'having', 'haven\'t', 'hasn\'t', 'hadn\'t', 'is', 'are', 'was', 'were', 'be', 'being', 'been', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'its', 'it\'s', 'that\'s', '--'];
const punctuations = [' ', '.', ',', '!', '?', ';', ':', '/', '"', '(', ')', '[', ']', '{', '}'];
type BlankData = {
    text: string;
    startindex: number;
    length: number;
    solved: boolean;
    index: number;
};
export const FillInContainer = ({ solving, setSolving, setSubmitted, questionData }: { solving: QuestionProgress, setSolving:any, setSubmitted:any, questionData: FillIn }) => {
    const [blanks, setBlanks] = useState<BlankData[]>([]);
    const [blankIndex, setBlankIndex] = useState(0);
    const blankIndexRef = useRef(blankIndex);
    const currentBlankRef = useRef<BlankData>();
    const blankCountRef = useRef(0);
    const enterSkipRef = useRef(false);
    const inputRefs = useRef<Array<HTMLInputElement>>([]);
    const init = () => {
        const blks: BlankData[] = [];
        const sentence = questionData.sentence;
        let startindex = 0;
        for (let i = 0; i <= sentence.length; i++) {
            if (i === sentence.length || punctuations.includes(sentence[i])) {
                if (!exceptions.includes(sentence.substring(startindex, i).toLowerCase()) && i - startindex > 1 && !!sentence.substring(startindex, i).match(/[a-z]/i) && (startindex === 0 || sentence[startindex].toUpperCase() !== sentence[startindex])) {
                    const blank: BlankData = { text: sentence.substring(startindex, i), startindex: startindex, length: i - startindex, solved: false, index: blks.length };
                    blks.push(blank);
                }
                startindex = i + 1;
            }
        }
        if(blks.length === 0) {
            setSolving((prev: QuestionProgress) => ({ ...prev, solved: 1 }));
            setSubmitted(true);
            return;
        }
        if (solving.individualProgress === undefined || solving.individualProgress.length !== blks.length) {
            setSolving((prev: QuestionProgress) => ({ ...prev, individualProgress: Array(blks.length).fill(0) }));
        }
        for (let i = 0; i < blks.length; i++) {
            if (solving.individualProgress[i] === 1) {
                blks[i].solved = true;
            }
        }
        let indexes = Array.from({ length: blks.length }, (_, i) => i).filter((i) => !blks[i].solved);
        shuffle(indexes);
        const sliceLength = Math.min(indexes.length, Math.ceil(blks.length / 2));
        indexes = indexes.slice(0, sliceLength);
        const newBlanks = blks.filter((_, i) => indexes.includes(i));
        setBlankIndex(0);
        blankIndexRef.current = 0;
        inputRefs.current = [];
        inputRefs.current = inputRefs.current.slice(0, newBlanks.length);
        inputRefs.current.length = newBlanks.length;
        currentBlankRef.current = newBlanks[0];
        blankCountRef.current = newBlanks.length;
        setBlanks(newBlanks);
    };

    const nextBlank = (correct: boolean) => {
        const bi = blankIndexRef.current;
        const next = () => {
            inputRefs.current[bi]!.disabled = true;
            inputRefs.current[bi+1]!.disabled = false;
            inputRefs.current[bi+1]!.focus();
            setBlankIndex((prev) => prev + 1);
        };
        const isLastBlank = bi === blankCountRef.current - 1;
        if (correct) setSolving((prev: QuestionProgress) => {
            const individualProgress = prev.individualProgress.slice();
            individualProgress[currentBlankRef.current!.index] = 1;
            const solved = individualProgress.reduce((a, b) => a + b, 0) / individualProgress.length;
            return { ...prev, individualProgress: individualProgress, solved: solved };
        });
        else inputRefs.current[bi].style.color = 'orangered';
        if (isLastBlank && !correct && enterSkipRef.current) {
            enterSkipRef.current = false;
            setSubmitted(true);
        } else if (isLastBlank && !correct) {
            enterSkipRef.current = true;
            inputRefs.current[bi].disabled = true;
        } else if (!correct) {
            next();
        } else if (isLastBlank) {
            setSubmitted(true);
        } else {
            next();
        }
    };

    useEffect(() => {
        blankIndexRef.current = blankIndex;
        currentBlankRef.current = blanks[blankIndex];
    }, [blankIndex]);

    const onKeyDown = (e: KeyboardEvent) => {
        setTimeout(() => {
            const currentBlank = currentBlankRef.current!;
            const value = inputRefs.current[blankIndexRef.current].value;
            if (e.code === 'Enter') {
                inputRefs.current[blankIndexRef.current].value = currentBlank.text;
                nextBlank(false);
            } else {
                if (value !== currentBlank.text) return;
                nextBlank(true);
            }
        }, 0);
    };

    useEffect(() => {
        if(!questionData) return;
        init();
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [questionData]);

    return (
        <div>
            <div className='text-xl'>
                {
                    blanks.map((blank, index) => (
                        <span key={`container-${index}`}>
                            <span key={`span-${index}`}>{questionData.sentence.substring((index === 0 ? 0 : blanks[index-1].startindex + blanks[index-1].length), blank.startindex)}</span>
                            <input
                                key={`input-${index}`}
                                autoFocus={index===blankIndex}
                                className='bg-gray-800 outline-none border-b-gray-200 border-b-2'
                                style={{width: blank.length.toString() + "ch"}}
                                ref={el => inputRefs.current[index] = el!}
                                type='text'
                                disabled={index !== 0}
                                maxLength={blank.length}
                            />
                        </span>
                    ))
                }
                { blanks.length !== 0 &&
                    <span>{questionData.sentence.substring(blanks[blanks.length-1].startindex + blanks[blanks.length-1].length)}</span>
                }
            </div>
        </div>
    );
};

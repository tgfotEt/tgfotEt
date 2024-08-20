import { useEffect, useState } from 'react';
import { storage } from '../config/firebase';
import { ref, getBytes } from 'firebase/storage';
import { MCQ } from '../config/types';
import { printLang } from '../config/lang';
export const MCQContainer = ({ active, setSolved, setSubmitted, questionData }: { active: boolean, setSolved: any, setSubmitted: any, questionData: MCQ }) => {
    const [selected, setSelected] = useState<boolean[]>([]);
    const [buttonColor, setButtonColor] = useState<string[]>([]);
    const [image, setImage] = useState<string>('');
    const init = () => {
        setSelected(Array(questionData.choices.length).fill(false));
        setButtonColor(Array(questionData.choices.length).fill("#404040"));
        if(questionData.img) {
            getBytes(ref(storage, 'images/' + questionData.img)).then((data) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage(e.target?.result as string);
                };
                reader.readAsDataURL(new Blob([data]));
            });
        }
    };
    useEffect(() => {
        if(!questionData) return;
        init();
    }, [questionData]);
    const onSelect = (i: number) => {
        const isMA = Array.isArray(questionData.answer);
        const newSelected = [...selected];
        if(isMA) newSelected[i] = !newSelected[i];
        else {
            newSelected.fill(false);
            newSelected[i] = true;
        }
        setSelected(newSelected);
    }
    const submit = () => {
        const isMA = Array.isArray(questionData.answer);
        const toMA = isMA ? questionData.answer as number[] : [questionData.answer as number];
        const selectedIndexes = selected.map((val, i) => val ? i : -1).filter((val) => val !== -1);
        if(isMA) {
            setSolved(selectedIndexes.length === toMA.length && toMA.every((val) => selectedIndexes.includes(val)));
        } else {
            setSolved(selectedIndexes.length === 1 && selectedIndexes[0] === toMA[0]);
        }
        const bColor = Array(questionData.choices.length).fill("#404040");
        for(let i = 0; i < selected.length; i++) {
            if (toMA.includes(i)) {
                bColor[i] = "green";
            } else if (selected[i]) {
                bColor[i] = "red";
            }
        }
        setSelected(Array(questionData.choices.length).fill(false));
        setButtonColor(bColor);
        setSubmitted(true);
    };
    return (
        <div>
            { image && <img src={image} alt='Question' className='object-contain w-full max-h-[40vh]' /> }
            <div className='text-left'>{ questionData.question }</div>
            <div className='flex flex-col gap-2 md:gap-3 py-2 md:py-3'>
                { questionData.choices.map((choice, i) => (
                    <button key={i} disabled={!active} className='bg-gray-700 rounded-md p-2 text-left' onClick={() => onSelect(i)} style={{backgroundColor: selected[i] ? "#888888" : buttonColor[i]}}>{choice}</button>
                ))}
            </div>
            <div className='flex justify-end'>
                <button disabled={!active} onClick={submit} className='bg-gray-700 rounded-md py-2 px-2 md:px-4 w-fit'>{printLang('submit')}</button>
            </div>
        </div>
    );
};

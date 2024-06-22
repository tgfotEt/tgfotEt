import { useEffect, useState } from 'react';
import { MCQ } from '../config/types';
export const MCQContainer = ({ active, setSolved, setSubmitted, questionData }: { active: boolean, setSolved: any, setSubmitted: any, questionData: MCQ }) => {
    const [selected, setSelected] = useState<boolean[]>([]);
    const [buttonColor, setButtonColor] = useState<string[]>([]);
    const init = () => {
        setSelected(Array(questionData.choices.length).fill(false));
        setButtonColor(Array(questionData.choices.length).fill("#404040"));
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
            <div className='text-left'>{ questionData.question }</div>
            <div className='flex flex-col gap-3 py-3'>
                { questionData.choices.map((choice, i) => (
                    <button key={i} disabled={!active} className='bg-gray-700 rounded-md p-2 text-left' onClick={() => onSelect(i)} style={{backgroundColor: selected[i] ? "#888888" : buttonColor[i]}}>{choice}</button>
                ))}
            </div>
            <div className='flex justify-end'>
                <button disabled={!active} onClick={submit} className='bg-gray-700 rounded-md py-2 px-4 w-fit'>Submit</button>
            </div>
        </div>
    );
};

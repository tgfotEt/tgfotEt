import { useRef, useState, useEffect } from 'react';
import { ref, getBytes } from 'firebase/storage';
import { storage } from '../config/firebase';
import { FRQ } from '../config/types';

export const FRQContainer = ({ active, setSolved, setSubmitted, questionData }: { active: boolean, setSolved: any, setSubmitted: any, questionData: FRQ }) => {
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [enterSkip, setEnterSkip] = useState(false);
    const [image, setImage] = useState<string>('');
    const init = () => {
        if (!questionData.img) return;
        getBytes(ref(storage, 'images/' + questionData.img)).then((data) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsText(new Blob([data]));
        });
    };
    useEffect(() => {
        if (!questionData) return;
        init();
    }, [questionData]);
    const textAreaChanged = () => {
        const val = textArea.current!.value;
        if (enterSkip && val.includes('\n')) {
            setSubmitted(true);
            setEnterSkip(false);
        } else if (enterSkip || val.includes('\n')) {
            setEnterSkip(true);
            textArea.current!.value = questionData.answer;
        } else if (val === questionData.answer) {
            setSolved(true);
            setSubmitted(true);
        }
    };
    return (
        <div className='h-full'>
            { image && <img src={image} alt='Question' className='object-contain w-full max-h-[40vh]' /> }
            <div className='text-left'>{ questionData.question }</div>
            <textarea
                className={`block bg-gray-700 rounded-md p-2 text-left resize-none w-full h-1/2 outline-none ${enterSkip ? 'text-orange-400' : ''}`}
                ref={ textArea }
                onInput={ textAreaChanged }
                disabled={!active}
                placeholder='Type your answer here'
            ></textarea>
        </div>
    );
};

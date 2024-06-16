import { MCQ } from '../config/types';
export const MCQContainer = ({ active, setSolved, setSubmitted, questionData }: { active: boolean, setSolved: any, setSubmitted: any, questionData: MCQ }) => {
    return (
        <div>
            { questionData.question }
            <div>
                { questionData.choices.map((choice, i) => (
                    <button key={i} onClick={() => {
                        setSolved(i === questionData.answer);
                        setSubmitted(true);
                    }}>{choice}</button>
                ))}
            </div>
        </div>
    );
};

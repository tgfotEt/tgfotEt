import { FRQ } from '../config/types';
// @ts-ignore
export const FRQContainer = ({ active, setSolved, setSubmitted, questionData }: { active: boolean, setSolved: any, setSubmitted: any, questionData: FRQ }) => {
    return (
        <div>
            <div>{ questionData.question }</div>
            <input onKeyDown={(e) => {
                if (e.code === 'Enter') {
                    setSolved(e.currentTarget.value === questionData.answer);
                    setSubmitted(true);
                }
            }} />
        </div>
    );
};

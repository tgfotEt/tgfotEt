import { Translate } from '../config/types';
// @ts-ignore
export const TranslateContainer = ({ active, setSolved, setSubmitted, questionData }: { active: boolean, setSolved: any, setSubmitted: any, questionData: Translate }) => {
    return (
        <div>
            <div>{ questionData.source }</div>
            <input onKeyDown={(e) => {
                if (e.code === 'Enter') {
                    setSolved(e.currentTarget.value === questionData.target);
                    setSubmitted(true);
                }
            }} />
        </div>
    );
};

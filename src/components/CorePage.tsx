import { useSearchParams } from 'react-router-dom';
export const CorePage = () => {
    const [currentPage, setCurrentPage] = useSearchParams();
    const qBankId = currentPage.get('id')!;
    const saveAndQuit = async () => {
        setCurrentPage({p:'qbdetail', id: qBankId});
    };
    return (
        <div>
            <button onClick={saveAndQuit}>Save and Quit</button>
            <div>{qBankId}</div>
        </div>
    );
};

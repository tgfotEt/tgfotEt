import { AboutPage } from './AboutPage';
import { QBankPage } from './QBankPage';
import { UserQBankPage } from './UserQBankPage';
import { SettingsPage } from './SettingsPage';
import { CreateQBankPage } from './CreateQBankPage';
export const PageContainer = ({ currentPage, setCurrentPage }) => {
    return (
        <div className='absolute inset-0 p-6 text-center'>
            { currentPage === 'about' && <AboutPage /> }
            { currentPage === 'qbank' && <QBankPage /> }
            { currentPage === 'userqb' && <UserQBankPage setCurrentPage={setCurrentPage} /> }
            { currentPage === 'createqb' && <CreateQBankPage setCurrentPage={setCurrentPage} /> }
            { currentPage === 'settings' && <SettingsPage /> }
        </div>
    );
}

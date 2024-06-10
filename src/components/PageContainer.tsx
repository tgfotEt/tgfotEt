import { AboutPage } from './AboutPage';
import { QBankPage } from './QBankPage';
import { UserQBankPage } from './UserQBankPage';
import { SettingsPage } from './SettingsPage';
import { CreateQBankPage } from './CreateQBankPage';
export const PageContainer = ({ currentPage, setCurrentPage }) => {
    console.log(currentPage);
    return (
        <div className='absolute inset-0 p-6 text-center'>
            { currentPage === 'about' && <AboutPage /> }
            { currentPage === 'qbank' && <QBankPage /> }
            { currentPage === 'userqb' && <UserQBankPage setCurrentPage={setCurrentPage} /> }
            { currentPage === 'createqb' && <CreateQBankPage setCurrentPage={setCurrentPage} toEdit={''} /> }
            { currentPage.startsWith('editqb ') && <CreateQBankPage setCurrentPage={setCurrentPage} toEdit={currentPage.split(' ')[1]} /> }
            { currentPage === 'settings' && <SettingsPage /> }
        </div>
    );
}

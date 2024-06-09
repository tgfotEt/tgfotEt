import { AboutPage } from './AboutPage';
import { QBankPage } from './QBankPage';
import { SettingsPage } from './SettingsPage';
export const PageContainer = ({ currentPage }) => {
    return (
        <div className='absolute inset-0 p-6 text-center'>
            { currentPage === 'about' && <AboutPage /> }
            { currentPage === 'qbank' && <QBankPage /> }
            { currentPage === 'settings' && <SettingsPage /> }
        </div>
    );
}

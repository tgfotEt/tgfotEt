import { useSearchParams } from 'react-router-dom';
import { AboutPage } from './AboutPage';
import { QBankPage } from './QBankPage';
import { UserQBankPage } from './UserQBankPage';
import { SettingsPage } from './SettingsPage';
import { CreateQBankPage } from './CreateQBankPage';
import { QBankDetailsPage } from './QBankDetailsPage';
import { CorePage } from './CorePage';
export const PageContainer = () => {
    const [searchParams, _] = useSearchParams();
    const currentPage = searchParams.get('p') || 'about';
    const currentId = searchParams.get('id') || '';
    return (
        <div className='absolute inset-0 p-6 text-center'>
            { currentPage === 'about' && <AboutPage /> }
            { currentPage === 'qbank' && <QBankPage /> }
            { currentPage === 'userqb' && <UserQBankPage /> }
            { currentPage === 'createqb' && <CreateQBankPage toEdit={''} /> }
            { currentPage === 'editqb' && <CreateQBankPage toEdit={currentId} /> }
            { currentPage === 'qbdetail' && <QBankDetailsPage key={currentId} qBankId={currentId} /> }
            { currentPage === 'core' && <CorePage /> }
            { currentPage === 'settings' && <SettingsPage /> }
        </div>
    );
}

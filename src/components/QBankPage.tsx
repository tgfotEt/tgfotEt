import { orderBy, where } from 'firebase/firestore';
import { QBankList } from './QBankList';
import { printLang } from '../config/lang';
export const QBankPage = () => {
    return (
        <div>
            <h1 className='text-3xl m-5'>{printLang('explore')}</h1>
            <div className='flex flex-col'>
                <div className='text-2xl mx-[10%] my-5 text-left'>{printLang('most_popular')}</div>
                <QBankList sortBy={ [where('unlisted', '==', false), orderBy('archived'), orderBy('downloads', 'desc')] } />
            </div>
        </div>
    );
};


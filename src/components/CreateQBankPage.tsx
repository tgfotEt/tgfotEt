import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, collection, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { auth, db, storage } from '../config/firebase';
import { isQuestionBank, QuestionBank, QuestionBankMetaData } from '../config/types';
import { LoadingOverlay } from './LoadingOverlay';
export const CreateQBankPage = ({ toEdit }) => {
    const [file, setFile] = useState<File|null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [_, setCurrentPage] = useSearchParams();
    const uploadFile = async () => {
        if (!file) return;
        const fileData = await file.text().then((data) => JSON.parse(data));
        if (!isQuestionBank(fileData)) throw new Error('Invalid file format');
        const fileDataTyped = fileData as QuestionBank;
        const docData: QuestionBankMetaData = {
            title: fileDataTyped.title,
            description: fileDataTyped.description,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            authorid: auth.currentUser!.uid,
            authorname: auth.currentUser!.displayName!,
            downloads: 0
        };
        if (toEdit) {
            const qbankDoc = doc(db, 'qbank', toEdit);
            const snapshot = await getDoc(qbankDoc); console.log("reading qbank data");
            if (!snapshot.exists()) throw new Error('Document does not exist');
            const createdAt = snapshot.data()!.createdAt;
            const downloadCount = snapshot.data()!.downloads;
            docData.createdAt = createdAt;
            docData.downloads = downloadCount;
            await setDoc(qbankDoc, docData);
        } else {
            const qbankDoc = await addDoc(collection(db, 'qbank'), docData);
            toEdit = qbankDoc.id;
        }
        const storageRef = ref(storage, 'qbank/' + toEdit);
        await uploadBytes(storageRef, file);
        setFile(null);
        setIsUploading(false);
        setCurrentPage({p:'userqb'});
    };
    useEffect(() => {
        const checkUser = async () => {
            if(!toEdit) return;
            const qbankDoc = doc(db, 'qbank', toEdit);
            const snapshot = await getDoc(qbankDoc);
            if (!snapshot.exists()) setCurrentPage({p:'qbdetail', id: toEdit});
            const authorid = snapshot.data()!.authorid;
            if (authorid !== auth.currentUser!.uid) setCurrentPage({p:'qbdetail', id: toEdit});
        }
        checkUser();
    }, []);
    return (
        <div>
            { toEdit 
                ? <>
                    <button className='bg-gray-700 rounded-md p-2 hover:bg-gray-600' onClick={() => setCurrentPage({p:'qbdetail', id: toEdit})}>Back</button>
                    <h1 className='text-3xl p-5'>Edit your Question Bank</h1>
                </>
                : <>
                    <button className='bg-gray-700 rounded-md p-2 hover:bg-gray-600' onClick={() => setCurrentPage({p:'userqb'})}>Back</button>
                    <h1 className='text-3xl p-5'>Create your own Question Bank</h1>
                </>
            }
            <label className='bg-gray-700 rounded-md p-2 hover:bg-gray-600 inline-block cursor-pointer'><input hidden type='file' accept='.json' onChange={(e) => {setFile((e.target as HTMLInputElement).files![0]); setIsUploading(true);}} />Choose file</label>
            <LoadingOverlay func={uploadFile} state={isUploading}> </LoadingOverlay>
        </div>
    );
}

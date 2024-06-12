import { useState } from 'react';
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
            docData.createdAt = createdAt;
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
    return (
        <div>
            { toEdit 
                ? <>
                    <button onClick={() => setCurrentPage({p:'qbdetail', id: toEdit})}>Back</button>
                    <h1>Edit your Question Bank</h1>
                </>
                : <>
                    <button onClick={() => setCurrentPage({p:'userqb'})}>Back</button>
                    <h1>Create your own Question Bank</h1>
                </>
            }
            <input type='file' accept='.json' onChange={(e) => setFile((e.target as HTMLInputElement).files![0])} />
            <button onClick={() => setIsUploading(true)}>Upload</button>
            <LoadingOverlay func={uploadFile} state={isUploading}> </LoadingOverlay>
        </div>
    );
}
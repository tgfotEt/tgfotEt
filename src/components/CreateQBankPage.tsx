import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';
import { isQuestionBank, QuestionBank } from '../config/types';
export const CreateQBankPage = ({ setCurrentPage }) => {
    const [file, setFile] = useState<File|null>(null);
    const uploadFile = async () => {
        try {
            if (!file) return;
            const fileData = await file.text().then((data) => JSON.parse(data));
            if (!isQuestionBank(fileData)) throw new Error('Invalid file format');
            const fileDataTyped = fileData as QuestionBank;
            const qbankRef = collection(db, 'qbank');
            const qbankDoc = await addDoc(qbankRef, {
                authorid: auth.currentUser!.uid,
                title: fileDataTyped.title,
                description: fileDataTyped.description,
                createdAt: new Date(),
            });
            const qbankId = qbankDoc.id;
            const storageRef = ref(storage, 'qbank/' + qbankId);
            await uploadBytes(storageRef, file);
            setFile(null);
            setCurrentPage('userqb');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <button onClick={() => setCurrentPage('userqb')}>Back</button>
            <h1>Create your own Question Bank</h1>
            <input type='file' accept='.json' onChange={(e) => setFile((e.target as HTMLInputElement).files![0])} />
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
}

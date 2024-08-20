import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, collection, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getBytes } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { auth, db, storage } from '../config/firebase';
import { isQuestionBank, QuestionBank, QuestionBankMetaData, MCQtemplate } from '../config/types';
import { LoadingOverlay } from './LoadingOverlay';
import { QuestionEdit } from './QuestionEdit';
import { ImageUpload } from './ImageUpload';
export const CreateQBankPage = ({ toEdit }) => {
    const [data, setData] = useState<QuestionBank>({title: '', description: '', questions: []});
    const [keys, setKeys] = useState<number[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [image, setImage] = useState<string>('');
    const [_, setCurrentPage] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const uploadFile = async () => {
        console.log('hi');
        if (!data) return;
        const dat = data;
        console.log(dat);
        if (!isQuestionBank(dat)) throw new Error('Invalid file format');
        const docData: QuestionBankMetaData = {
            title: dat.title,
            description: dat.description,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            authorid: auth.currentUser!.uid,
            authorname: auth.currentUser!.displayName!,
            downloads: 0,
            unlisted: dat.unlisted ?? false,
            archived: dat.archived ?? false,
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
        const file = new Blob([JSON.stringify(dat)], { type: 'application/json' });
        await uploadBytes(storageRef, file);
        setData({title: '', description: '', questions: []});
        setIsUploading(false);
        setCurrentPage({p:'userqb'});
    };
    const setFile = async (file: File) => {
        const fileData = await file.text().then((text) => JSON.parse(text));
        if (!isQuestionBank(fileData)) throw new Error('Invalid file format');
        setData(fileData as QuestionBank);
        console.log(fileData);
        setIsUpdating(false);
    };
    const setQuestionData = (index: number, value: any) => {
        setData({...data, questions: data.questions.map((q, i) => i === index ? value : q)});
    }
    const addQuestion = (q=MCQtemplate) => {
        setData({...data, questions: data.questions.concat(q)});
        setKeys(keys.concat(Math.max(...keys, -1) + 1));
    };
    const deleteQuestion = (index: number) => {
        setData({...data, questions: data.questions.filter((_, i) => i !== index)});
        setKeys(keys.filter((_, i) => i !== index));
    }
    const onSelectImage = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageURL = reader.result?.toString() || '';
            setImage(imageURL);
        });
        reader.readAsDataURL(file);
    }
    useEffect(() => {
        const load = async () => {
            if(!toEdit) return;
            const qbankDoc = doc(db, 'qbank', toEdit);
            const snapshot = await getDoc(qbankDoc);
            if (!snapshot.exists()) setCurrentPage({p:'qbdetail', id: toEdit});
            const authorid = snapshot.data()!.authorid;
            if (authorid !== auth.currentUser!.uid) setCurrentPage({p:'qbdetail', id: toEdit});
            const storageRef = ref(storage, 'qbank/' + toEdit);
            const file = await getBytes(storageRef).then((data) => JSON.parse(new TextDecoder().decode(data)));
            setData(file as QuestionBank);
            setKeys((file as QuestionBank).questions.map((_, i) => i));
        }
        load();
    }, []);
    return (
        <div>
            <button className='bg-gray-700 rounded-md p-2 hover:bg-gray-600 m-2' onClick={() => setIsUploading(true)}>Save and Exit</button>
            <button className='bg-gray-700 rounded-md p-2 hover:bg-gray-600 m-2' onClick={() => history.back()}>Don't Save</button>
            <h1 className='text-3xl p-5'>
                {
                    toEdit ? 'Edit Question Bank' : 'Create Question Bank'
                }
            </h1>
            <label className='bg-gray-700 rounded-md p-2 hover:bg-gray-600 inline-block cursor-pointer'><input hidden ref={inputRef} type='file' accept='.json' onChange={() => setIsUpdating(true)} />Choose file</label>
            <div className='flex flex-col'>
                <div className='text-left m-2'>Title</div>
                <input className='rounded-md p-2 m-2 bg-gray-700 outline-none' placeholder='Title...' value={data.title ?? ''} onChange={(e) => setData({...data, title: e.target.value})} />
                <div className='text-left m-2'>Description</div>
                <input className='rounded-md p-2 m-2 bg-gray-700 outline-none' placeholder='Description...' value={data.description ?? ''} onChange={(e) => setData({...data, description: e.target.value})} />
                <div className='p-2 grid grid-cols-2'>
                    <button className={`rounded-md p-2 hover:bg-gray-600 ${data.unlisted ? 'bg-gray-700' : 'bg-gray-600'}`} onClick={() => setData({...data, unlisted: false})}>Public</button>
                    <button className={`rounded-md p-2 hover:bg-gray-600 ${data.unlisted ? 'bg-gray-600' : 'bg-gray-700'}`} onClick={() => setData({...data, unlisted: true})}>Private</button>
                </div>
                <div className='p-2 grid grid-cols-2'>
                    <button className={`rounded-md p-2 hover:bg-gray-600 ${data.archived ? 'bg-gray-700' : 'bg-gray-600'}`} onClick={() => setData({...data, archived: false})}>Active</button>
                    <button className={`rounded-md p-2 hover:bg-gray-600 ${data.archived ? 'bg-gray-600' : 'bg-gray-700'}`} onClick={() => setData({...data, archived: true})}>Archived</button>
                </div>
                <div>
                    {
                        data.questions.map((q, index) => (
                            <QuestionEdit key={keys[index]} qVal={q} deleteQ={() => deleteQuestion(index)} setQVal={(val: any) => setQuestionData(index, val)} />
                        ))
                    }
                </div>
                <div className='grid grid-cols-2'>
                <button className='rounded-md p-2 m-2 bg-gray-700 hover:bg-gray-600' onClick={() => addQuestion()}>Add Question</button>
                <label className='bg-gray-700 rounded-md p-2 m-2 hover:bg-gray-600 inline-block cursor-pointer'>
                    <input hidden type='file' accept='image/*' onChange={onSelectImage} capture />
                    Add Question With Image
                </label>
                </div>
            </div>
            <LoadingOverlay func={async () => {await setFile(inputRef.current!.files![0])}} state={isUpdating}> </LoadingOverlay>
            <LoadingOverlay func={uploadFile} state={isUploading}> </LoadingOverlay>
            { image && 
                <ImageUpload image={image} setImage={setImage} addQuestion={addQuestion} />
            }
        </div>
    );
};

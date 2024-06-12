import { db, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { UserData, QuestionBankMetaData } from './types';

export function getData(): UserData {
    return JSON.parse(localStorage.getItem('data') || '{}') as UserData;
}

export function setData(data: UserData) {
    localStorage.setItem('data', JSON.stringify(data));
}

export async function syncData() {
    const userId = auth.currentUser!.uid;
    const userRef = doc(db, 'users', userId);
    const data = getData();
    await setDoc(userRef, data);
}

export async function setSyncData(data: UserData) {
    setData(data);
    await syncData();
}

export async function fetchData() {
    const userId = auth.currentUser!.uid;
    const userRef = doc(db, 'users', userId);
    await getDoc(userRef).then((doc) => {
        if (doc.exists()) {
            setData(doc.data() as UserData);
        }
    });
}

export function addQBank(qBankId: string, title: string) {
    const data = getData();
    data.qb[qBankId] = {
        title: title,
        lastUsed: Timestamp.now(),
        progress: []
    };
    setData(data);
}

export async function addSyncQBank(qBankId: string, title: string, ) {
    addQBank(qBankId, title);
    await syncData();
}

export async function initQBank() {
    const userId = auth.currentUser!.uid;
    const qBankDoc = doc(db, 'users', userId);
    const snapshot = await getDoc(qBankDoc);
    if (!snapshot.exists()) {
        await setDoc(qBankDoc, { qb: {} } as UserData);
        setData({ qb: {} } as UserData);
    } else {
        setData(snapshot.data() as UserData);
    }
}

export function removeQBank(qBankId: string) {
    const data = getData();
    delete data.qb[qBankId];
    setData(data);
}

export async function removeSyncQBank(qBankId: string, ) {
    removeQBank(qBankId);
    const docRef = doc(db, 'qbank', qBankId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        await updateDoc(docRef, { downloads: snapshot.data()!.downloads - 1 });
    }
    await syncData();
}

export async function downloadSyncQBank(qBankId: string, ) {
    const qBankDoc = doc(db, 'qbank', qBankId);
    const snapshot = await getDoc(qBankDoc); console.log("reading qbank data");
    if (!snapshot.exists()) throw new Error('Document does not exist');
    const qBankMetaData = snapshot.data() as QuestionBankMetaData;
    await updateDoc(qBankDoc, { downloads: qBankMetaData.downloads + 1 });
    addSyncQBank(qBankId, qBankMetaData.title);
}

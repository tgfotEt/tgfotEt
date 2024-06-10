import { db } from './firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
export function getData() {
    return JSON.parse(localStorage.getItem('data') || '{}');
}

export function setData(data: any) {
    localStorage.setItem('data', JSON.stringify(data));
}

export async function syncData(userId: string) {
    const userRef = doc(db, 'users', userId);
    const data = getData();
    await setDoc(userRef, data);
}

export async function setSyncData(userId: string, data: any) {
    setData(data);
    await syncData(userId);
}

export async function fetchData(userId: string) {
    const userRef = doc(db, 'users', userId);
    await getDoc(userRef).then((doc) => {
        if (doc.exists()) {
            setData(doc.data());
        }
    });
}

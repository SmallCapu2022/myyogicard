// Client-only Firestore wrapper (uses the lite build to avoid node/grpc dependencies in the browser)

import { getFirestore } from "firebase/firestore";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore/lite";
import { app } from "./firebase";

const db = getFirestore(app);

export async function getUserCards(studentId: string) {
  const q = query(collection(db, "cards"), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id }));
}

export async function getStudio(studioId: string) {
  const ref = doc(db, "studios", studioId);
  const snap = await getDoc(ref);
  if (!snap) return null;
  return { ...(snap.data() as any), id: snap.id };
}

export async function requestCard(
  studentId: string,
  studioId: string,
  type: string,
  price: number,
  studentName: string
) {
  await addDoc(collection(db, "cardRequests"), {
    studentId,
    studioId,
    type,
    price,
    studentName,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getStudioRequests(studioId: string) {
  const q = query(collection(db, "cardRequests"), where("studioId", "==", studioId));
  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id }));
}

export async function getStudentsByStudio(studioId: string) {
  const q = query(collection(db, "users"), where("studios", "array-contains", studioId), where("role", "==", "student"));
  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id }));
}

export async function getCardsByStudio(studioId: string) {
  const q = query(collection(db, "cards"), where("studioId", "==", studioId));
  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ ...(d.data() as any), id: d.id }));
}

export async function countCardsByStatus(studioId: string) {
  const cards = await getCardsByStudio(studioId);
  return {
    active: cards.filter((c: any) => c.status === "active").length,
    expired: cards.filter((c: any) => c.status === "expired").length,
    pending: cards.filter((c: any) => c.status === "pending").length,
  };
}

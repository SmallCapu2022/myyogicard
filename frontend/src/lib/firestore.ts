import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

/** ======================
 * 🔹 USERS
 =======================*/
export async function getUser(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateUser(uid: string, data: any) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** ======================
 * 🔹 STUDIOS
 =======================*/
export async function createStudio(user: any, name: string, location: string) {
  const studioRef = await addDoc(collection(db, "studios"), {
    name,
    location,
    ownerId: user.uid,
    ownerEmail: user.email,
    teachers: [user.uid],
    students: [],
    cardTypes: [],
    acceptSingleClass: false,
    createdAt: serverTimestamp(),
  });

  await updateUser(user.uid, { studioId: studioRef.id, isOwner: true });
  return studioRef.id;
}

export async function updateStudioCardTypes(
  studioId: string,
  cardTypes: any[],
  acceptSingleClass: boolean
) {
  const ref = doc(db, "studios", studioId);
  await updateDoc(ref, { cardTypes, acceptSingleClass });
}

export async function getStudio(studioId: string) {
  const ref = doc(db, "studios", studioId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllStudios() {
  const q = query(collection(db, "studios"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** ======================
 * 🔹 CARD REQUESTS
 =======================*/
export async function requestCard(studentId: string, studioId: string, type: string, price: number) {
  await addDoc(collection(db, "cardRequests"), {
    studentId,
    studioId,
    type,
    price,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getStudioRequests(studioId: string) {
  const q = query(collection(db, "cardRequests"), where("studioId", "==", studioId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function approveCardRequest(requestId: string, remaining: number) {
  const reqRef = doc(db, "cardRequests", requestId);
  const reqSnap = await getDoc(reqRef);
  if (!reqSnap.exists()) throw new Error("Demande introuvable");
  const data = reqSnap.data();

  await addDoc(collection(db, "cards"), {
    studentId: data.studentId,
    studioId: data.studioId,
    type: data.type,
    remaining,
    status: "active",
    createdAt: serverTimestamp(),
  });

  await updateDoc(reqRef, { status: "accepted" });
}

export async function rejectCardRequest(requestId: string) {
  const ref = doc(db, "cardRequests", requestId);
  await updateDoc(ref, { status: "rejected" });
}

/** ======================
 * 🔹 CARDS
 =======================*/
export async function getUserCards(studentId: string) {
  const q = query(collection(db, "cards"), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function markCardAsPaid(requestId: string) {
  const reqRef = doc(db, "cardRequests", requestId);
  const reqSnap = await getDoc(reqRef);
  if (!reqSnap.exists()) throw new Error("Demande introuvable");

  const data = reqSnap.data();

  // Création de la vraie carte dans 'cards'
  await addDoc(collection(db, "cards"), {
    studentId: data.studentId,
    studioId: data.studioId,
    type: data.type,
    remaining: data.type.includes("10") ? 10 : 5,
    status: "active",
    createdAt: serverTimestamp(),
  });

  // Mise à jour du statut de la demande
  await updateDoc(reqRef, { status: "paid" });
}

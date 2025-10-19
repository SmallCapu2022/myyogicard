import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

// ───────────────────────────────
// 🔹 Interfaces typées
// ───────────────────────────────

export interface Card {
  id: string;
  studioId: string;
  studentId: string;
  type: string;
  remaining: number;
  status: "active" | "expired" | "pending" | "paid";
  createdAt?: any;
}

export interface Studio {
  id: string;
  name: string;
  ownerId: string;
  teachers?: string[];
  students?: string[];
  cardTypes: { label: string; sessions: number; price: number }[];
  acceptSingleClass: boolean;
}

export interface CardRequest {
  id: string;
  studentId: string;
  studioId: string;
  studentName?: string;
  type: string;
  price: number;
  status: "pending" | "accepted" | "paid" | "rejected";
  createdAt?: any;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "student" | "teacher" | "admin";
  studios?: string[]; // ✅ un élève peut appartenir à plusieurs studios
  isOwner?: boolean;
}

// ───────────────────────────────
// 👤 UTILISATEURS
// ───────────────────────────────

/** Récupère un utilisateur complet */
export async function getUser(userId: string) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}

/** Ajoute un studio à la liste d’un élève */
export async function addStudioToUser(userId: string, studioId: string) {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, { studios: arrayUnion(studioId) });
}

// ───────────────────────────────
// 🧘 STUDIOS
// ───────────────────────────────

/** Crée un nouveau studio */
export async function createStudio(
  owner: User | string,
  name: string,
  location: string
) {
  const ownerId = typeof owner === 'string' ? owner : owner.id;
  
  const studiosRef = collection(db, "studios");
  const docRef = await addDoc(studiosRef, {
    name,
    location,
    ownerId,
    teachers: [ownerId],
    students: [],
    cardTypes: [],
    acceptSingleClass: false,
    createdAt: serverTimestamp(),
  });

  // Met à jour le user comme propriétaire
  const userRef = doc(db, "users", ownerId);
  await updateDoc(userRef, {
    isOwner: true,
    studios: arrayUnion(docRef.id),
  });

  return docRef.id;
}

/** Rejoint un studio existant */
export async function joinStudio(userId: string, studioId: string) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { studios: arrayUnion(studioId) });

  const studioRef = doc(db, "studios", studioId);
  await updateDoc(studioRef, { students: arrayUnion(userId) });
}

/** Récupère tous les studios */
export async function getAllStudios() {
  const snap = await getDocs(collection(db, "studios"));
  return snap.docs.map((d) => ({ ...(d.data() as Studio), id: d.id }));
}

/** Récupère un studio spécifique */
export async function getStudio(studioId: string) {
  console.log("Fetching studio with ID:", studioId);
  const ref = doc(db, "studios", studioId);
  const snap = await getDoc(ref);
  console.log("Studio snapshot exists:", snap.exists());
  if (!snap.exists()) return null;
  const studio = { ...(snap.data() as Studio), id: snap.id };
  console.log("Studio data:", studio);
  return studio;
}

/** Met à jour la configuration des cartes et options */
export async function updateStudioCardTypes(
  studioId: string,
  cardTypes: { label: string; sessions: number; price: number }[],
  acceptSingleClass: boolean
) {
  const ref = doc(db, "studios", studioId);
  await updateDoc(ref, { cardTypes, acceptSingleClass });
}

// ───────────────────────────────
// 🎟️ DEMANDES DE CARTES
// ───────────────────────────────

/** Création d'une demande de carte par un élève */
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

/** Liste toutes les demandes d'un studio */
export async function getStudioRequests(studioId: string) {
  const q = query(collection(db, "cardRequests"), where("studioId", "==", studioId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as CardRequest), id: d.id }));
}

/** Écoute les demandes d'un studio en temps réel */
export function listenToStudioRequests(
  studioId: string,
  onChange: (requests: CardRequest[]) => void
) {
  const q = query(collection(db, "cardRequests"), where("studioId", "==", studioId));
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const requests = snapshot.docs.map((d) => ({ ...(d.data() as CardRequest), id: d.id }));
    onChange(requests);
  });
}

/** Accepte une demande de carte */
export async function approveCardRequest(requestId: string) {
  const ref = doc(db, "cardRequests", requestId);
  await updateDoc(ref, { status: "accepted" });
}

/** Refuse une demande */
export async function rejectCardRequest(requestId: string) {
  const ref = doc(db, "cardRequests", requestId);
  await updateDoc(ref, { status: "rejected" });
}

/** Marque une demande comme payée et crée la carte active */
export async function markCardAsPaid(requestId: string) {
  const reqRef = doc(db, "cardRequests", requestId);
  const reqSnap = await getDoc(reqRef);
  if (!reqSnap.exists()) throw new Error("Demande introuvable");

  const data = reqSnap.data() as CardRequest;

  // 🔒 Vérifie si une carte active existe déjà pour ce studio
  const q = query(
    collection(db, "cards"),
    where("studentId", "==", data.studentId),
    where("studioId", "==", data.studioId),
    where("status", "==", "active")
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    console.warn("Une carte active existe déjà pour ce studio !");
    return;
  }

  // Crée la nouvelle carte
  await addDoc(collection(db, "cards"), {
    studentId: data.studentId,
    studioId: data.studioId,
    type: data.type,
    remaining: data.type.includes("10") ? 10 : 5,
    status: "active",
    createdAt: serverTimestamp(),
  });

  // Met à jour la demande
  await updateDoc(reqRef, { status: "paid" });
}

// ───────────────────────────────
// 💳 CARTES ACTIVES
// ───────────────────────────────

/** Récupère toutes les cartes d’un élève (multi-studios) */
export async function getUserCards(studentId: string) {
  const q = query(collection(db, "cards"), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Card), id: d.id }));
}

/** Récupère toutes les cartes liées à un studio */
export async function getCardsByStudio(studioId: string) {
  const q = query(collection(db, "cards"), where("studioId", "==", studioId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Card), id: d.id }));
}

/** Compte les cartes par statut */
export async function countCardsByStatus(studioId: string) {
  const cards = await getCardsByStudio(studioId);
  return {
    active: cards.filter((c) => c.status === "active").length,
    expired: cards.filter((c) => c.status === "expired").length,
    pending: cards.filter((c) => c.status === "pending").length,
  };
}

/** Liste les élèves appartenant à un studio */
export async function getStudentsByStudio(studioId: string) {
  const q = query(
    collection(db, "users"),
    where("studios", "array-contains", studioId), // ✅ adaptation multi-studio
    where("role", "==", "student")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as User), id: d.id }));
}

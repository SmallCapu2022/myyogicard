// src/lib/firebaseClient.ts

import { app } from "./firebase";

// Export a function that lazily imports the Firestore helpers at runtime.
// Use the "lite" version which is the web-optimized bundle and avoids
// the problematic package exports in some environments.
export async function getDb() {
	// Import the exact ESM bundle file to avoid issues with Node's package
	// "exports" resolution in some environments.
	const mod = await import("firebase/firestore/lite/dist/esm/index.esm.js");
	const getFirestore = mod.getFirestore ?? mod.default?.getFirestore;
	if (!getFirestore) throw new Error('getFirestore not found in firestore lite bundle');
	return getFirestore(app);
}

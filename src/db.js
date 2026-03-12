// ─── DATABASE OPERATIONS ─────────────────────────────────────────────────────
// All reads and writes to Firebase Firestore go through here

import {
  collection, doc, getDocs, setDoc, deleteDoc,
  addDoc, query, orderBy, onSnapshot, updateDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase.js";

// ── GROUPS ────────────────────────────────────────────────────────────────────

export const subscribeToGroups = (userId, callback) => {
  const ref = collection(db, "users", userId, "groups");
  const q = query(ref, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const groups = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(groups);
  });
};

export const saveGroup = async (userId, group) => {
  const { id, ...data } = group;
  const ref = doc(db, "users", userId, "groups", id);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const createGroup = async (userId, group) => {
  const { id, ...data } = group;
  const ref = doc(db, "users", userId, "groups", id);
  await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
};

export const deleteGroup = async (userId, groupId) => {
  await deleteDoc(doc(db, "users", userId, "groups", groupId));
  // Also clean up history
  const histRef = collection(db, "users", userId, "history", groupId, "messages");
  const snap = await getDocs(histRef);
  for (const d of snap.docs) await deleteDoc(d.ref);
};

// ── HISTORY ───────────────────────────────────────────────────────────────────

export const saveToHistory = async (userId, groupId, content) => {
  const ref = collection(db, "users", userId, "history", groupId, "messages");
  await addDoc(ref, {
    content,
    createdAt: serverTimestamp(),
    date: new Date().toISOString(),
  });
};

export const subscribeToHistory = (userId, groupId, callback) => {
  const ref = collection(db, "users", userId, "history", groupId, "messages");
  const q = query(ref, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(messages);
  });
};

export const getAllHistory = async (userId, groupId) => {
  const ref = collection(db, "users", userId, "history", groupId, "messages");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

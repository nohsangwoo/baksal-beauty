"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase-config";

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

export function getFirebaseApp() {
  if (!firebaseApp) {
    firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);
  }

  return firebaseApp;
}

export function getFirebaseAuth() {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }

  return firebaseAuth;
}

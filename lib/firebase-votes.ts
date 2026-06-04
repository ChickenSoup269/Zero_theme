"use client"

import { User, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import {
  collection,
  doc,
  increment,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import { auth, db, isFirebaseConfigured as configured } from "./firebase"
export const isFirebaseConfigured = configured
import { ThemeItem } from "./types"

export type VoteCounts = Record<string, number>

const LOCAL_VOTED_KEY = "zero-theme-gallery-firebase-voted-v1"

export function getLocalVotedIds(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(LOCAL_VOTED_KEY) || "{}")
  } catch {
    return {}
  }
}

export function setLocalVoted(themeId: string, voted = true) {
  if (typeof window === "undefined") return
  const current = getLocalVotedIds()
  current[themeId] = voted
  localStorage.setItem(LOCAL_VOTED_KEY, JSON.stringify(current))
}

export async function getAnonymousUser(): Promise<User> {
  if (!auth || !isFirebaseConfigured) {
    throw new Error(
      "Firebase chưa được cấu hình. Hãy thêm NEXT_PUBLIC_FIREBASE_* vào .env.local.",
    )
  }

  if (auth.currentUser) return auth.currentUser

  return await new Promise<User>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth!, async (user) => {
      unsubscribe()
      if (user) {
        resolve(user)
        return
      }

      try {
        const credential = await signInAnonymously(auth!)
        resolve(credential.user)
      } catch (error) {
        reject(error)
      }
    })
  })
}

export function listenThemeVotes(onChange: (counts: VoteCounts) => void) {
  if (!db || !isFirebaseConfigured) {
    onChange({})
    return () => {}
  }

  return onSnapshot(collection(db, "themes"), (snapshot) => {
    const counts: VoteCounts = {}
    snapshot.forEach((themeDoc) => {
      const data = themeDoc.data()
      counts[themeDoc.id] = Number(data.votes ?? 0)
    })
    onChange(counts)
  })
}

export async function voteTheme(item: ThemeItem) {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase chưa được cấu hình.")
  }

  const user = await getAnonymousUser()
  const themeRef = doc(db, "themes", item.id)
  const voterRef = doc(db, "themes", item.id, "voters", user.uid)

  await runTransaction(db, async (tx) => {
    const voterSnap = await tx.get(voterRef)

    if (voterSnap.exists()) {
      throw new Error("Bạn đã vote theme này rồi.")
    }

    tx.set(
      themeRef,
      {
        title: item.title,
        votes: increment(1),
        downloads: 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    tx.set(voterRef, {
      createdAt: serverTimestamp(),
    })
  })

  setLocalVoted(item.id, true)
}

export async function countDownload(item: ThemeItem) {
  if (!db || !isFirebaseConfigured) return
  const themeRef = doc(db, "themes", item.id)
  await setDoc(
    themeRef,
    {
      title: item.title,
      downloads: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

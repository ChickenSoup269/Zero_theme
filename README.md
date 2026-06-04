# Zero Theme Gallery

Next.js theme gallery cho file JSON Start Page.

## Điểm chính

- Theme card có ảnh preview cố định từ `previewImage` hoặc `theme.settings.background`.
- User chỉ tải JSON, không copy code JSON.
- Nút ★ vote thật bằng Firebase Anonymous Auth + Firestore.
- Mỗi anonymous `uid` chỉ vote 1 lần cho mỗi theme.
- Có đếm download JSON.
- Có đổi giao diện sáng/tối và tiếng Việt/English.

## Chạy local

```bash
npm install
npm run dev
```

## Firebase real vote setup

1. Firebase Console → Authentication → Sign-in method → enable **Anonymous**.
2. Firebase Console → Firestore Database → Create database.
3. Copy `.env.example` to `.env.local` and paste your Firebase web config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

4. Restart dev server after editing `.env.local`:

```bash
npm run dev
```

5. Paste `firestore.rules` into Firestore Rules, then Publish.

Firestore will auto-create documents like this when a user votes:

```txt
themes/{themeId}
  title: "Theme title"
  votes: 1
  downloads: 0

themes/{themeId}/voters/{anonymousUid}
  createdAt: timestamp
```

Nếu bấm ★ mà không tăng Firebase, kiểm tra 3 lỗi thường gặp: `.env.local` thiếu tiền tố `NEXT_PUBLIC_`, chưa bật Anonymous Auth, hoặc chưa restart `npm run dev`.

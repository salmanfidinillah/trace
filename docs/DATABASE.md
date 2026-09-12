# TRACE — DATABASE DESIGN

## 1. Database decision

Database utama TRACE adalah **Cloud Firestore**. Firebase Authentication menjadi sumber identitas. Semua data aplikasi harus diturunkan dari `uid` Firebase.

## 2. Prinsip data

- simpan sesedikit mungkin;
- pisahkan data publik dan private;
- jangan simpan raw password;
- simpan hasil yang sudah dinormalisasi, bukan raw provider response;
- gunakan timestamp server;
- sediakan retention dan penghapusan data;
- semua akses private dibatasi oleh uid.

## 3. Struktur koleksi

```text
users/{uid}
  /scans/{scanId}
    /exposures/{exposureId}
  /recommendations/{recommendationId}
  /checklist/{itemId}
  /alerts/{alertId}
  /aiAnalyses/{analysisId}
  /auditEvents/{eventId}

providerCache/{cacheKey}
systemConfigs/{configId}
```

`providerCache` dan `systemConfigs` hanya dapat diakses server dengan Admin SDK. Jangan membuka koleksi tersebut ke browser.

## 4. users/{uid}

Field:

```text
uid: string
email: string | null
displayName: string | null
photoURL: string | null
emailVerified: boolean
createdAt: timestamp
updatedAt: timestamp
lastLoginAt: timestamp | null
privacyVersion: string
```

Email dapat disimpan terenkripsi atau dalam bentuk yang sesuai dengan kebijakan privasi. Jangan menambahkan data profil yang tidak dibutuhkan.

## 5. users/{uid}/scans/{scanId}

Field:

```text
type: "email" | "password"
status: "completed" | "no_exposure" | "failed"
maskedIdentifier: string | null
identifierFingerprint: string | null
score: number | null
level: "low" | "moderate" | "elevated" | "high" | "critical" | null
exposureCount: number
providerName: string | null
providerVersion: string | null
createdAt: timestamp
completedAt: timestamp | null
expiresAt: timestamp | null
```

Untuk password scan, buat history hanya jika metadata non-rahasia diperlukan; jangan simpan fingerprint password sebagai cara untuk mengenali password.

## 6. exposures/{exposureId}

Field aman:

```text
serviceName: string
year: number | null
dataTypes: string[]
severity: "low" | "medium" | "high" | "critical"
sourceReference: string | null
summary: string | null
createdAt: timestamp
```

Jangan menyimpan raw record, password, token, alamat korban lain, atau field yang tidak diperlukan UI.

## 7. risk assessment

Disimpan dalam scan atau subdokumen terpisah jika diperlukan:

```text
score: number
level: string
factors: [
  {
    key: string,
    label: string,
    contribution: number,
    explanation: string
  }
]
engineVersion: string
createdAt: timestamp
```

## 8. recommendations

```text
title: string
description: string
priority: "critical" | "high" | "medium" | "low"
reason: string
status: "todo" | "in_progress" | "done"
sourceScanId: string | null
createdAt: timestamp
updatedAt: timestamp
completedAt: timestamp | null
```

## 9. checklist

```text
key: string
title: string
description: string
status: "todo" | "done"
order: number
updatedAt: timestamp
```

Checklist default dapat dibuat saat onboarding atau saat user pertama kali membuka dashboard.

## 10. alerts

```text
type: "new_exposure" | "action_due" | "system"
title: string
message: string
severity: "info" | "warning" | "high"
read: boolean
sourceScanId: string | null
createdAt: timestamp
```

## 11. aiAnalyses

```text
scanId: string | null
kind: "basic_explanation" | "personal_analyst"
summary: string
topRisks: string[]
actions: string[]
modelName: string
promptVersion: string
createdAt: timestamp
```

Jangan menyimpan prompt mentah jika mengandung identifier sensitif. Simpan versi prompt dan metadata yang diperlukan untuk audit.

## 12. auditEvents

Simpan metadata minimal:

```text
action: string
actorUid: string | null
resourceType: string
resourceId: string | null
result: "success" | "failure"
createdAt: timestamp
```

Jangan memasukkan password, token, raw email, atau raw provider response ke audit log.

## 13. Index yang direncanakan

- `users/{uid}/scans` berdasarkan `createdAt desc`;
- scans berdasarkan `type` dan `createdAt desc`;
- recommendations berdasarkan `status`, `priority`, dan `createdAt`;
- alerts berdasarkan `read` dan `createdAt desc`;
- exposures berdasarkan `year desc` jika query timeline membutuhkan index.

Index dibuat hanya berdasarkan query yang benar-benar digunakan.

## 14. Retention

- public result: temporary dan tidak disimpan permanen secara default;
- authenticated email scan: disimpan sampai user menghapus atau masa retention berakhir;
- password scan: tidak menyimpan secret atau history rahasia;
- AI summary: dapat dihapus bersama scan sumber;
- audit event: retention terbatas dan bebas dari data rahasia.

## 15. Firestore rules policy

- user hanya boleh membaca/menulis dokumen di `users/{request.auth.uid}`;
- client tidak boleh menulis `uid`, `createdAt`, score, provider metadata, atau audit event secara bebas;
- hasil scan dan score dibuat server-side;
- providerCache dan systemConfigs tidak dapat dibaca client;
- validasi tipe, ukuran, enum, dan field whitelist wajib diterapkan.

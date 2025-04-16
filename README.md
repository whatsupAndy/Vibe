🌿 Vibe
Vibe er en minimalistisk mobilapp laget med Expo og React Native, hvor brukere kan opprette, utforske og melde seg på aktiviteter. Appen bruker Firebase for autentisering og datalagring. Designet er enkelt og moderne, med neon-grønn styling og støtte for bildeopplasting.

🔧 Teknologier brukt
React Native (med Expo)

Expo Router for navigasjon

Firebase Authentication og Firestore

Expo ImagePicker for bildevalg

🗂️ Mappestruktur
bash
Kopier
Rediger
Vibe/  
│── app/  
│   ├── activity/                # Detaljer og oppmelding for aktiviteter  
│   │   ├── _layout.tsx  
│   │   ├── +not-found.tsx  
│   ├── tabs/                    # Fane-navigasjon  
│   │   ├── _layout.tsx  
│   ├── index.tsx               # Hovedskjerm  
│   ├── login.tsx               # Innlogging  
│   ├── register.tsx            # Registrering  
│   ├── settings.tsx            # Innstillinger  
│── assets/  
│   ├── fonts/  
│   ├── images/                 # Inkl. logo.png  
│── components/                # Gjenbrukbare komponenter som ReturnBtn  
│── firebaseConfig.ts          # Firebase-oppsett  
│── app.config.js              # Expo-konfig  
│── tsconfig.json              # TypeScript-oppsett  
│── README.md  
🚀 Kom i gang
Installasjon
Klon repoet:

bash
Kopier
Rediger
git clone <repo-url>
cd Vibe
Installer avhengigheter:

bash
Kopier
Rediger
npm install
Start Expo:

bash
Kopier
Rediger
npx expo start
🔐 Firebase-oppsett
Firestore regler (oppdatert):

js
Kopier
Rediger
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /activities/{document=**} {
      allow read, write: if request.auth != null;
    }

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
🧩 Funksjonalitet
✅ Brukerregistrering og -innlogging

✅ Opprettelse av nye aktiviteter

✅ Påmelding til aktiviteter (med deltakerbegrensning)

✅ Bildevalg fra galleriet

✅ Firebase-integrasjon for lagring og autentisering

✅ Minimalistisk grensesnitt med SafeAreaView-støtte

💡 Viktige kodeeksempler
Hente aktiviteter:
ts
Kopier
Rediger
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

async function fetchActivities() {
  const querySnapshot = await getDocs(collection(db, "activities"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
Påmelding:
ts
Kopier
Rediger
import { doc, updateDoc } from "firebase/firestore";

async function handleSignUp(userId: string, activityId: string, participants: string[]) {
  const activityRef = doc(db, "activities", activityId);
  await updateDoc(activityRef, { participants: [...participants, userId] });
}
Velge bilde fra galleri:
ts
Kopier
Rediger
import * as ImagePicker from "expo-image-picker";

async function pickImage(setImage: (uri: string) => void) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
}
🔭 Mulig videre utvikling
📍 Kartvisning av aktiviteter

🔔 Push-varsler ved påmelding

💬 Kommentarfelt eller meldingssystem

🎨 Mer avansert design og animasjoner



Bilder kan legges til i assets/images og vises her.

✨ Takk for at du bruker Vibe!
Laget med ❤️ og 💡 med fokus på enkelhet, miljø og fellesskap.

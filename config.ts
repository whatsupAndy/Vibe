export const APP_CONFIG = {
  appName: "PaddleForOcean",
  primaryColor: "#007AFF", // Blå (kan brukes for knapper eller lenker)
  secondaryColor: "#34C759", // Grønn (kan brukes for suksessmeldinger)
  backgroundColor: "#f8f9fa", // Lys bakgrunn
  cardColor: "#fff", // Hvit for kort og modaler
  firebaseCollection: "cleanup_trips", // 🔹 Riktig Firebase-kolleksjon for ryddeaksjoner
};

export const TEXTS = {
  homeTitle: "Tilgjengelige ryddeaksjoner",
  newActivityTitle: "Opprett en ny ryddeaksjon",
  inputPlaceholders: {
    location: "Sted (f.eks. Oslofjorden)",
    date: "Dato (YYYY-MM-DD)",
    time: "Tidspunkt (klokkeslett)",
    maxParticipants: "Maks deltakere",
  },
  buttons: {
    addActivity: "➕ Ny ryddeaksjon",
    save: "Lagre ryddeaksjon",
    delete: "🗑 Slett ryddeaksjon",
    join: "✅ Meld deg på",
    leave: "❌ Meld deg av",
  },
  messages: {
    full: "⚠️ Denne ryddeaksjonen er full.",
    joined: "🎉 Du er nå påmeldt!",
    left: "❌ Du har meldt deg av.",
    error: "❌ Noe gikk galt. Prøv igjen.",
  },
};

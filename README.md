# Agency Hub by fl0w
## Funktionsumfang für Agenturinhaber

Diese Dokumentation bietet Agenturinhabern einen strukturierten Überblick über die Kernfunktionen und Rollen der **Agency Hub App**. Ziel ist ein effizientes Management sowie eine reibungslose Zusammenarbeit zwischen allen Beteiligten.

---

## 1. Rollenbasierter Zugriff und Dashboards

Die App nutzt ein rollenbasiertes Zugriffssystem. Sichtbare Funktionen und Dashboards variieren je nach Benutzerrolle.

### Admin-Rolle
- **Dashboard**  
  Zentrale Übersicht über alle relevanten Kennzahlen und Aktivitäten der Agentur.
- **Bewerbungen**  
  Verwaltung von Chatter- und Model-Bewerbungen (ansehen, genehmigen, ablehnen).
- **Nutzer**  
  Vollständige Benutzerverwaltung (Rollen ändern, Status verwalten, VIPs einladen).
- **Schichtplan**  
  Erstellung, Verwaltung und Zuweisung von Schichten für Chatter.
- **Models**  
  Verwaltung aller Model-Profile.
- **Schulungen**  
  Erstellung und Pflege von Schulungsinhalten.
- **Dokumente**  
  Zentrale Verwaltung von Verträgen, NDAs und weiteren Dokumenten.
- **VIP Videos**  
  Verwaltung von Videokategorien und Videoinhalten für VIPs.
- **Einstellungen**  
  Globale App-Einstellungen.
- **Benachrichtigungen**  
  Hinweise zu neuen Registrierungen (VIP, Model, Chatter) sowie VIP-Einladungen.

### Chatter-Rolle
- **Dashboard**  
  Persönliche Übersicht mit kommenden Schichten und Schulungsstatus.
- **Meine Schichten**  
  Einsicht in den individuellen Schichtplan.
- **Schulungen**  
  Zugriff auf relevante Schulungen inklusive Fortschrittsanzeige.
- **Einstellungen**  
  Persönliche Kontoeinstellungen.

### Model-Rolle
- **Dashboard**  
  Übersicht über Profilstatus, Dokumente und OnlyFans-Statistiken.
- **Mein Profil**  
  Bearbeitung von Künstlername, Biografie, Bildern und Tags.
- **Dokumente**  
  Upload und Signierung eigener Dokumente.
- **Team Chat**  
  Interne Kommunikation mit dem Team.
- **Einstellungen**  
  Persönliche Kontoeinstellungen.

### VIP-Rolle
- **VIP Dashboard**  
  Zugriff auf exklusive Videoinhalte nach Kategorien.
- **Einstellungen**  
  Persönliche Kontoeinstellungen.

---

## 2. Benutzerverwaltung und Einladungen

### Nutzerübersicht (Admin)
- Suche und Filter nach Name, E-Mail, Rolle und Status.
- Änderung von Benutzerrollen (Admin, Chatter, Model, VIP).
- Verwaltung des Benutzerstatus (aktiv, inaktiv, ausstehend).

### VIP-Einladung (Admin)
- Direkte Einladung von VIPs per E-Mail.
- Registrierungslink mit Passwortvergabe oder Google-Login.
- Automatische Benachrichtigung aller Admins nach erfolgreicher Registrierung.

---

## 3. Benachrichtigungssystem (Admins)

- **Benachrichtigungsglocke**  
  Anzeige der Anzahl ungelesener Benachrichtigungen im Header.
- **Benachrichtigungsarten**
  - `vip_invited`
  - `model_registered`
  - `chatter_registered`
  - `user_registered`
- **Inhalt**
  - Titel
  - Beschreibung
  - E-Mail des betroffenen Nutzers
  - Erstellungsdatum
- **Statusverwaltung**
  - Einzelne oder alle Benachrichtigungen als gelesen markieren.

---

## 4. Videoverwaltung (Admin & VIP)

### Admin Video Management
- Erstellung, Bearbeitung und Löschung von Videokategorien  
  (Name, Beschreibung, Vorschaubild, Reihenfolge).
- Verwaltung von Videos  
  (Titel, YouTube-URL, Kategorie, Beschreibung, Vorschaubild, Dauer, Reihenfolge).
- Zentrale Übersicht der gesamten Video-Bibliothek.

### VIP Dashboard
- Anzeige der Videos nach Kategorien.
- Abspielen von YouTube-Videos direkt innerhalb der App.

---

## 5. Formulare und Uploads

- **Profilbearbeitung (Model)**  
  Verwaltung von Profildaten, Bildern und Tags.
- **Dokumenten-Upload**  
  Hochladen, Anzeigen und Verwalten von Dokumenten.
- **Dateiuploads**  
  Unterstützung für verschiedene Dateitypen  
  (Profilbilder, Lebensläufe, Verträge, weitere Dokumente).

---

## 6. Technologie und Responsive Design

- **Frontend**  
  React, TypeScript, Tailwind CSS.
- **Backend**  
  Base44 Backend as a Service mit Authentifizierung und Datenbank.
- **Responsive Design**  
  Optimiert für Desktop, Tablet und Smartphone.

---

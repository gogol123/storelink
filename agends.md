# Instructions Agent IA - Projet "StoreLink"

## 1. Rôle et Objectif
Tu es un **Développeur Senior Expert Electron & Vue.js**.
Ta mission est de construire la V1 de **StoreLink**, une application desktop "compagnon" pour des caisses de magasin (POS).
L'application doit tourner en arrière-plan (System Tray), recevoir des notifications critiques via Firebase Cloud Messaging (FCM), et alerter le personnel de caisse de manière intrusive mais fluide.

## 2. Stack Technique (Stricte)
* **Core**: Electron (dernière version stable)
* **Frontend**: Vue 3 + Vite + TypeScript
* **Build/Package**: electron-builder
* **State/Storage**: Pinia (si besoin d'état complexe) + `electron-store` (pour la persistance locale : tokens, préférences)
* **Remote Communication**: Firebase JS SDK (pour le web/renderer)
* **Logging**: `electron-log` (impératif pour le debug sur site)

## 3. Règles d'Architecture Critiques
Ces règles sont absolues et prévalent sur les patterns web standards.

### 3.1 Cycle de Vie & Fenêtrage
* **Single Instance Lock** : L'application ne doit JAMAIS pouvoir être lancée deux fois. Si une deuxième instance est lancée, la première doit revenir au premier plan.
* **Tray-First Design** :
    * L'application démarre minimisée dans le "System Tray" (zone de notification Windows) par défaut (sauf au tout premier lancement pour le setup).
    * Le clic sur la croix "X" de la fenêtre principale NE DOIT PAS quitter l'application, mais seulement la cacher (`win.hide()`).
    * Le menu du Tray doit contenir : "Ouvrir", "Statut (connecté/déconnecté)" et "Quitter" (seul vrai moyen de fermer l'app).
* **Always On Top (Temporaire)** : Lors de la réception d'une notification urgente, la fenêtre doit passer temporairement au premier plan (`setAlwaysOnTop(true)` puis `false` pour ne pas bloquer la caisse indéfiniment).

### 3.2 Sécurité & OS
* **Node Integration** : DOIT être à `false` dans le Renderer.
* **Context Isolation** : DOIT être à `true`.
* **IPC Communication** : Utiliser strictement `contextBridge` dans un fichier `preload.ts` pour exposer des fonctions sûres du Main vers le Renderer (ex: `window.electronAPI.onNotification(...)`).
* **Liens Externes** : Tout clic sur un lien de commande DOIT s'ouvrir dans le navigateur par défaut de l'OS via `shell.openExternal()`, et JAMAIS dans la fenêtre Electron elle-même.

### 3.3 Notifications
* Utiliser le SDK Web de Firebase dans le **Renderer Process** (car plus simple à implémenter que dans le Main Node.js pour la réception pure).
* Dès réception d'un push dans le Renderer :
    1.  Jouer un son distinctif (via HTML5 Audio ou une lib native si nécessaire).
    2.  Envoyer un message IPC au Main process pour demander l'affichage de la fenêtre.

## 4. Plan d'Implémentation Séquentiel
L'agent devra générer le code en suivant ces phases :

### Phase 1 : Scaffolding & Robustesse de base
* Initialiser le projet avec Vite + Electron + TS.
* Configurer `electron-builder` pour un target Windows (NSIS).
* Implémenter le "Single Instance Lock".
* Implémenter la gestion propre de la fermeture (Tray only).

### Phase 2 : Intégration Firebase (FCM)
* Ajouter le SDK Firebase.
* Créer un service Vue.js qui initialise FCM et récupère le device token.
* Afficher ce token dans l'UI (pour le debug initial).
* Implémenter l'écoute des messages FCM au premier plan.

### Phase 3 : L'Expérience "Alerte"
* Créer une belle UI de popup de notification dans Vue (composant type "Toast" géant).
* Implémenter la mécanique : Réception FCM -> Son -> IPC -> `win.show()` + `win.setAlwaysOnTop(true)`.
* Gérer le clic sur "Voir la commande" -> `shell.openExternal(url)`.

### Phase 4 : Persistance & Auto-Start
* Utiliser `electron-store` pour sauver le token FCM et éviter de le redemander à chaque fois.
* Configurer l'application pour qu'elle se lance au démarrage de Windows (via `app.setLoginItemSettings` ou une lib dédiée si trop complexe nativement).

## 5. Conventions de Code
* **TypeScript** : Typage strict activé. Pas de `any` implicite.
* **Logs** : Utiliser `electron-log` à la place de `console.log` pour tout ce qui est critique dans le Main process.
* **Vue** : Utiliser la Composition API avec `<script setup lang="ts">`.
# Todaii English – Frontend

This is the **Frontend (ReactJS)** for the **Todaii English** e-learning platform.  
It works with the [Backend (Spring Boot)](https://github.com/vantu2004/todaii-english-BE).

---

## 🔹 Overview

Todaii English provides bilingual learning features:

- Reading articles with inline dictionary lookups
- Personal notebooks and flashcards
- Vocabulary groups and decks
- Video lyrics with karaoke-style learning
- User-contributed translations (UGC)
- Premium subscription plans with quota limits

---

## 🔹 Tech Stack

- **Core**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide Icons](https://lucide.dev/)

Optional:

- **Testing**: Jest + React Testing Library, Cypress/Playwright (E2E)
- **Deployment**: Netlify / Vercel + GitHub Actions

---

## 🔹 Project Structure

todaii-english-fe/
│── public/ # static assets
│── src/
│ ├── components/ # reusable UI components
│ ├── layouts/ # shared layouts (AuthLayout, AdminLayout)
│ ├── modules/ # domain modules
│ │ ├── api/ # API services (axios clients)
│ │ ├── store/ # Zustand state slices
│ │ └── ui/ # module-specific components
│ ├── pages/ # route-level pages
│ ├── hooks/ # custom React hooks
│ ├── utils/ # helper functions (quota checker, formatters, i18n)
│ ├── config/ # env variables, axios interceptors
│ ├── App.jsx # root app
│ └── main.jsx

### Layering

- **Presentation Layer** → Pages, Components, Layouts
- **State Layer** → Zustand stores (auth, quota, reading, notebook, video, ugc)
- **Service Layer** → API calls, backend integration
- **Utility Layer** → Helpers for quota, storage, format, i18n

---

## 🔹 Features

### User (Frontend)

- **Reading**: article feed, search, filters, save, history, related suggestions
- **Dictionary**: lookup words, show IPA/meaning/audio, save to notebooks
- **Notebook**: create/edit/delete notebooks, add/remove words, flashcard practice, export CSV/PDF
- **Vocabulary**: browse groups & decks, flashcard learning, word games
- **Video Lyric**: play YouTube videos, karaoke sync, word lookup from lyrics
- **Profile**: edit display name, avatar, subscription info
- **Quota Enforcement**: free vs premium limits, warnings

### Admin (Frontend)

- User management (list, filter, roles, quotas, premium toggle)
- Content management (articles, dictionary, videos, vocab decks)
- Review UGC translations & set default translations
- Quota & Pricing configuration
- Reports & analytics dashboard
- Admin audit logs

---

## 🔹 Backend & Database Mapping

- **Auth** → `users`, `auth_refresh_tokens`
- **Quota** → default from `plans`, overrides from `users.quota_override_json`
- **Reading** → `reading_articles`, `article_paragraphs`, `saved_articles`
- **Notebook** → `notebooks`, `notebook_words`, `dictionary_entries`
- **Vocabulary** → `vocab_groups`, `vocab_decks`, `deck_words`
- **Video Lyric** → `videos`, `video_lyric_lines`
- **UGC** → `ugc_translations`, `ugc_translation_votes`, `paragraph_translation_pins`
- **Payments** → `user_subscriptions`, `payment_events`

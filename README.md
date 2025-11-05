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

```text
src/
├── api/                      # Chứa tất cả API call (axios instance, endpoints)
│   ├── clients/
│   │   ├── authApi.js
│   │   └── userApi.js
│   └── admins/
│       ├── authApi.js
│       └── userApi.js
│
├── assets/                   # Hình ảnh, logo, fonts, v.v.
│
├── components/               # Reusable components (Button, Navbar, FormInput,...)
│
├── config/                   # File cấu hình chung (axios config, route config, env, v.v.)
│   ├── axios.js
│   └── routes/
│       ├── ClientRoutes.jsx  # 👈 Route dành cho Client
│       └── AdminRoutes.jsx   # 👈 Route dành cho Admin
│
├── context/                  # React Contexts (global state)
│   ├── clients/
│   │   ├── AuthContext.jsx
│   │   └── useAuth.js
│   └── admins/
│       ├── AdminAuthContext.jsx
│       └── useAdminAuth.js
│
├── hooks/                    # Custom hooks (useFetch, useDebounce,...)
│
├── modules/                  # Chứa các feature lớn (module hoá app)
│   ├── clients/
│   │   ├── components/       # Component riêng cho client
│   │   ├── pages/            # Trang client: Login, Register, Dashboard...
│   │   └── layouts/          # Layout tổng thể (ClientLayout.jsx)
│   └── admins/
│       ├── components/
│       ├── pages/
│       └── layouts/
│
├── utils/                    # Hàm tiện ích dùng chung (formatDate, handleError,...)
│
├── App.jsx                   # Chứa BrowserRouter chính
├── main.jsx                  # Entry file (ReactDOM.createRoot)
├── index.css
└── vite.config.js
```

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

```

```

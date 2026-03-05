<div align="center">

<h1>story</h1>

<p>Modern React admin panel — fast, typed, beautiful.</p>

<!-- STACK BADGES -->
<p>
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>
<p>
  <img src="https://img.shields.io/badge/shadcn%2Fui-latest-18181B?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/React_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/Jotai-latest-C678DD?style=for-the-badge" alt="Jotai" />
</p>
<p>
  <img src="https://img.shields.io/badge/Axios-latest-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/Zod-latest-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Vitest-latest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Storybook-latest-FF4785?style=for-the-badge&logo=storybook&logoColor=white" alt="Storybook" />
</p>
<p>
  <img src="https://img.shields.io/badge/ESLint-latest-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-latest-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
  <img src="https://img.shields.io/badge/Husky-latest-F7B93E?style=for-the-badge" alt="Husky" />
  <img src="https://img.shields.io/badge/Docker-latest-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

</div>

---

## ⚡ Komendy

| Komenda           | Opis                    |
| ----------------- | ----------------------- |
| `yarn dev`        | Dev server              |
| `yarn build`      | Build (domyślny)        |
| `yarn build:prod` | Build produkcyjny       |
| `yarn build:test` | Build testowy           |
| `yarn test`       | Uruchom testy           |
| `yarn test:watch` | Testy w trybie watch    |
| `yarn lint`       | Sprawdź ESLint          |
| `yarn format`     | Formatuj kod (Prettier) |
| `yarn storybook`  | Uruchom Storybook       |

---

## 📁 Struktura projektu

```
story/
├── .github/
│   └── ISSUE_TEMPLATE/     # szablony zgłoszeń
├── .husky/                 # git hooks
├── .storybook/             # konfiguracja Storybook
├── public/
│   └── fonts/              # czcionki .woff2
├── src/
│   ├── app/
│   │   ├── features/       # moduły funkcjonalne
│   │   ├── layouts/        # layouty stron
│   │   ├── pages/          # strony
│   │   ├── providers/      # React providers
│   │   ├── services/       # serwisy API
│   │   ├── shared/         # komponenty, utils, ui-base
│   │   ├── app.tsx         # główny komponent
│   │   └── routes.tsx      # definicja tras
│   ├── environments/       # konfiguracja środowisk
│   ├── templates/          # szablony
│   └── tests/              # setup testów
├── .env                    # zmienne lokalne
├── .env.test               # zmienne testowe
├── .env.prod               # zmienne produkcyjne
├── .gitlab-ci.yml          # pipeline CI/CD
├── Dockerfile              # konteneryzacja
└── commitlint.config.cjs   # reguły commitów
```

---

## 🚀 Pierwsze uruchomienie

```bash
yarn install
yarn dev
```

---

## 📝 Conventional Commits

Projekt używa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nowa funkcja
fix: naprawa błędu
chore: aktualizacja zależności
refactor: refaktoryzacja
docs: dokumentacja
```

# LMS Platform (Unified Online University)

Role-based LMS платформа на **Next.js (App Router)** + **React** + **TypeScript**.

## Getting Started

Запуск dev-сервера:

```bash
npm run dev
```

Откройте `http://localhost:3000`.

## Роли и маршруты (как переключаться)

Платформа организована по ролям. **Первый сегмент URL — это роль**, далее идут секции/страницы роли.

Примеры:

- Applicant:
  - `/applicant/dashboard`
- Student:
  - `/student/dashboard`
- Teacher:
  - `/teacher/dashboard`
- Academic:
  - `/academic/dashboard`
- AQAD:
  - `/aqad/dashboard`
- Resource Department:
  - `/resource/dashboard`
- Accountant:
  - `/accountant/dashboard`
- Deputy Director:
  - `/deputy/dashboard`
- Admin:
  - `/admin/dashboard`
- IT Operations:
  - `/it-ops/dashboard`

Чтобы “переключиться” на другую роль — просто откройте в браузере соответствующий URL (или поменяйте первый сегмент пути).

### Где настраиваются роли и пункты меню

- `config/roles.ts`: список ролей и их навигация (sidebar).
- `app/(platform)/{role}/{section}/page.tsx`: страницы конкретной роли и секции.

## Полезные команды

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```

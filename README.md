




# Chat Box AI Backend

NestJS backend for Chat Box AI application with PostgreSQL integration.

## Features

- 🔐 JWT Authentication
- 👥 User Management (CRUD)
- 🗄️ PostgreSQL Database Integration
- 📚 Swagger API Documentation
- 🔒 Route Protection
- ✅ Input Validation
- 🏗️ Clean Architecture

## Installation

```bash
npm install


```structure
chat_box_ai_backend/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env
├── .gitignore
├── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── database/
    │   └── database.module.ts
    ├── users/
    │   ├── users.module.ts
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── entities/
    │   │   └── user.entity.ts
    │   └── dto/
    │       ├── create-user.dto.ts
    │       ├── update-user.dto.ts
    │       └── user-response.dto.ts
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── dto/
    │   │   ├── login.dto.ts
    │   │   └── register.dto.ts
    │   ├── guards/
    │   │   └── jwt-auth.guard.ts
    │   └── strategies/
    │       ├── jwt.strategy.ts
    │       └── local.strategy.ts
    └── common/
        ├── decorators/
        │   └── current-user.decorator.ts
        └── interfaces/
            └── jwt-payload.interface.ts
```
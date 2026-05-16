```bash
server/
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/                           # Authentication module
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts            # Login request body validation
│   │   │   │   └── register.dto.ts         # Register request body validation
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts         # JWT token verify strategy
│   │   │   ├── auth.controller.ts          # /auth routes (login, register)
│   │   │   ├── auth.service.ts             # Login/register business logic
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/                          # User module
│   │   │   ├── dto/
│   │   │   │   └── update-user.dto.ts      # Profile update body validation
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts          # MongoDB User schema (name, email, role...)
│   │   │   ├── users.controller.ts         # /users routes (profile, update)
│   │   │   ├── users.service.ts            # User CRUD logic
│   │   │   └── users.module.ts
│   │   │
│   │   ├── courses/                        # Course module
│   │   │   ├── dto/
│   │   │   │   ├── create-course.dto.ts    # New course body validation
│   │   │   │   └── update-course.dto.ts    # Update course body validation
│   │   │   ├── schemas/
│   │   │   │   └── course.schema.ts        # MongoDB Course schema (type: recorded | physical)
│   │   │   ├── courses.controller.ts       # /courses routes (CRUD, browse)
│   │   │   ├── courses.service.ts          # Course business logic
│   │   │   └── courses.module.ts
│   │   │
│   │   ├── enrollments/                    # Enrollment module (who bought what)
│   │   │   ├── schemas/
│   │   │   │   └── enrollment.schema.ts    # MongoDB Enrollment schema (userId, courseId, status)
│   │   │   ├── enrollments.controller.ts   # /enrollments routes
│   │   │   ├── enrollments.service.ts      # Enrollment logic (check access, enroll)
│   │   │   └── enrollments.module.ts
│   │   │
│   │   └── payments/                       # Payment module
│   │       ├── dto/
│   │       │   └── create-payment.dto.ts   # Payment initiate body validation
│   │       ├── schemas/
│   │       │   └── payment.schema.ts       # MongoDB Payment schema (amount, method, status)
│   │       ├── providers/
│   │       │   ├── sslcommerz.provider.ts  # SSLCommerz integration logic (extendable later)
│   │       │   └── bkash.provider.ts       # bKash integration logic (extendable later)
│   │       ├── payments.controller.ts      # /payments routes (initiate, success, fail)
│   │       ├── payments.service.ts         # Payment orchestration logic
│   │       └── payments.module.ts
│   │
│   ├── common/                             # Shared across all modules
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts           # Checks if user is logged in
│   │   │   └── roles.guard.ts              # Checks if user has required role
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts   # @CurrentUser() → JWT থেকে user বের করে
│   │   │   └── roles.decorator.ts          # @Roles('admin') → route এ role set করে
│   │   └── filters/
│   │       └── http-exception.filter.ts    # Global error response format
│   │
│   ├── config/
│   │   ├── database.config.ts              # MongoDB connection config
│   │   └── env.validation.ts               # .env variables validation (joi)
│   │
│   ├── app.module.ts                       # Root module, সব module import হয় এখানে
│   └── main.ts                             # App bootstrap, CORS, global pipes
│
├── .env                                    # Environment variables (DB, JWT, payment keys)
├── .env.example                            # .env এর template (repo তে রাখো)
└── package.json
```



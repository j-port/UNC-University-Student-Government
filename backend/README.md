# Backend README

Welcome to the UNC Student Government API backend! This README provides an overview of the backend architecture, setup instructions, and links to detailed documentation.

## 🚀 Quick Start

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (choose one)
DB_TYPE=supabase  # or 'postgres'

# Supabase Configuration (if using Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# PostgreSQL Configuration (if using PostgreSQL)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=usg_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_SSL=false
```

### Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

### API Documentation

Once the server is running, visit:

```
http://localhost:5000/api/docs
```

This provides an interactive Swagger UI where you can:

-   Browse all available endpoints
-   See request/response schemas
-   Try out API calls directly
-   Test with authentication

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── __tests__/           # Test files
│   │   ├── setup.js
│   │   ├── helpers.js
│   │   └── middleware/
│   ├── config/
│   │   ├── databaseFactory.js   # Database factory pattern
│   │   └── swagger.js           # API documentation config
│   ├── db/
│   │   ├── index.js             # Database facade
│   │   ├── BaseRepository.js
│   │   ├── SupabaseRepository.js
│   │   ├── PostgresRepository.js
│   │   └── repositories/        # Domain repositories
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization
│   │   ├── errorHandler.js      # Error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── validateRequest.js   # Validation middleware
│   │   └── validation.js        # Zod schemas
│   ├── routes/                  # API endpoints
│   │   ├── feedback.js
│   │   ├── announcements.js
│   │   ├── officers.js
│   │   └── ... (11 total)
│   ├── utils/
│   │   ├── errors.js            # Custom error classes
│   │   └── validateEnv.js       # Environment validation
│   └── index.js                 # Express app entry point
├── jest.config.js               # Test configuration
├── package.json
└── [Documentation Files]        # See below
```

---

## 📚 Documentation

Comprehensive guides are available in the `backend/` directory:

| Document                                             | Description                                           |
| ---------------------------------------------------- | ----------------------------------------------------- |
| [DATABASE_SETUP.md](DATABASE_SETUP.md)               | How to set up Supabase or PostgreSQL                  |
| [DATABASE_MIGRATION.md](DATABASE_MIGRATION.md)       | How to migrate from Supabase to PostgreSQL            |
| [MIDDLEWARE_GUIDE.md](MIDDLEWARE_GUIDE.md)           | How to use authentication, validation, error handling |
| [ROUTE_MIGRATION_GUIDE.md](ROUTE_MIGRATION_GUIDE.md) | How routes were updated with middleware               |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md)         | How to add Swagger documentation                      |
| [TESTING_GUIDE.md](TESTING_GUIDE.md)                 | How to write and run tests                            |
| [BACKEND_IMPROVEMENTS.md](BACKEND_IMPROVEMENTS.md)   | Summary of all improvements made                      |

---

## 🔑 Key Features

### ✅ Database Abstraction

Switch between Supabase and PostgreSQL with a single environment variable:

```env
DB_TYPE=supabase  # or 'postgres'
```

No code changes required! The factory pattern handles everything.

### ✅ Security

-   **JWT Authentication**: Secure endpoints with Supabase authentication
-   **Role-Based Access**: Admin-only routes protected with email verification
-   **Input Validation**: All requests validated with Zod schemas
-   **Rate Limiting**: Prevent abuse with configurable rate limits
-   **SQL Injection Protection**: Parameterized queries for PostgreSQL

### ✅ Error Handling

-   Centralized error handling with custom error classes
-   Consistent error responses across all endpoints
-   Stack traces in development, hidden in production
-   Special handling for validation, authentication, and database errors

### ✅ API Documentation

-   Interactive Swagger UI at `/api/docs`
-   Automatically generated from JSDoc comments
-   Try endpoints directly from browser
-   Authentication support built-in

### ✅ Testing

-   Jest testing framework configured
-   70+ middleware tests included
-   Test utilities and mocks provided
-   Coverage reports available

---

## 🔧 Available Scripts

```bash
# Development
npm run dev           # Start server with auto-reload

# Production
npm start             # Start server

# Testing
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

---

## 🌐 API Endpoints

### Public Endpoints

| Method | Endpoint                   | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| GET    | `/api/health`              | Health check                       |
| POST   | `/api/feedback`            | Submit feedback (rate limited)     |
| GET    | `/api/feedback/track/:ref` | Track feedback by reference number |
| GET    | `/api/announcements`       | Get all published announcements    |
| GET    | `/api/officers`            | Get all officers                   |
| GET    | `/api/organizations`       | Get all organizations              |
| GET    | `/api/committees`          | Get all committees                 |

### Protected Endpoints (Admin Only)

All CRUD operations for:

-   Announcements
-   Officers
-   Organizations
-   Committees
-   Financial Transactions
-   Issuances
-   Governance Documents
-   Site Content
-   Page Content

**Authentication Required**: Add `Authorization: Bearer <token>` header

---

## 🛡️ Middleware Stack

Every request goes through:

1. **CORS** - Allow cross-origin requests
2. **Body Parser** - Parse JSON and URL-encoded bodies
3. **Morgan Logger** - Log HTTP requests
4. **Rate Limiter** - Prevent abuse
5. **Authentication** - Verify JWT tokens (if required)
6. **Authorization** - Check admin permissions (if required)
7. **Validation** - Validate request data with Zod
8. **Route Handler** - Process the request
9. **Error Handler** - Catch and format errors

---

## 🔐 Authentication

### Getting a Token

Users authenticate through the frontend using Supabase Auth. The frontend receives a JWT token which is sent with requests:

```javascript
// Frontend example
const response = await fetch("http://localhost:5000/api/announcements", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(announcementData),
});
```

### Admin Access

Admin routes require:

1. Valid JWT token
2. Email ending with `@unc.edu.ph`

---

## 📊 Rate Limits

| Endpoint Type       | Limit                       |
| ------------------- | --------------------------- |
| General API         | 100 requests per 15 minutes |
| Feedback Submission | 5 requests per hour         |
| Admin Operations    | 200 requests per 15 minutes |
| Authentication      | 5 requests per 15 minutes   |

When limit is exceeded, API returns `429 Too Many Requests`

---

## ⚙️ Environment Variables

### Required

```env
PORT=5000
DB_TYPE=supabase  # or 'postgres'
```

### Supabase (if DB_TYPE=supabase)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### PostgreSQL (if DB_TYPE=postgres)

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=usg_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_SSL=false  # or 'true' for production
```

### Optional

```env
NODE_ENV=development  # or 'production'
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Structure

```
src/__tests__/
├── setup.js              # Global test configuration
├── helpers.js            # Test utilities and mocks
├── middleware/
│   ├── auth.test.js      # Authentication tests
│   ├── errorHandler.test.js
│   └── validation.test.js
├── repositories/         # (To be implemented)
└── routes/               # (To be implemented)
```

### Writing Tests

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive examples and best practices.

---

## 🐛 Error Responses

All errors follow this format:

```json
{
    "success": false,
    "error": "Error message"
}
```

Validation errors include details:

```json
{
    "success": false,
    "error": "Validation failed",
    "details": [
        {
            "field": "email",
            "message": "Invalid email format"
        }
    ]
}
```

---

## 📈 Health Check

Check if the API is running:

```bash
curl http://localhost:5000/api/health
```

Response:

```json
{
    "status": "ok",
    "message": "USG API is running",
    "timestamp": "2024-01-15T10:30:45.123Z",
    "database": "supabase"
}
```

---

## 🔄 Switching Databases

### From Supabase to PostgreSQL

1. Set up PostgreSQL database (see [DATABASE_SETUP.md](DATABASE_SETUP.md))
2. Run migration scripts (see [DATABASE_MIGRATION.md](DATABASE_MIGRATION.md))
3. Update `.env`:
    ```env
    DB_TYPE=postgres
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_DB=usg_db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=your-password
    ```
4. Restart server

No code changes needed!

### From PostgreSQL to Supabase

1. Update `.env`:
    ```env
    DB_TYPE=supabase
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_SERVICE_KEY=your-key
    ```
2. Restart server

---

## 📦 Dependencies

### Production

-   **express** - Web framework
-   **@supabase/supabase-js** - Supabase client
-   **pg** - PostgreSQL client
-   **cors** - CORS middleware
-   **dotenv** - Environment variables
-   **zod** - Schema validation
-   **express-rate-limit** - Rate limiting
-   **morgan** - HTTP logging
-   **jsonwebtoken** - JWT utilities
-   **swagger-ui-express** - API documentation UI
-   **swagger-jsdoc** - Generate OpenAPI spec

### Development

-   **nodemon** - Auto-reload during development
-   **jest** - Testing framework
-   **supertest** - HTTP testing
-   **@types/jest** - Jest TypeScript definitions

---

## 🚀 Deployment

### Production Checklist

-   [ ] Set `NODE_ENV=production`
-   [ ] Use strong database credentials
-   [ ] Enable SSL for PostgreSQL (`POSTGRES_SSL=true`)
-   [ ] Set appropriate rate limits
-   [ ] Configure CORS origins
-   [ ] Set up error monitoring
-   [ ] Enable access logging
-   [ ] Use environment secrets management
-   [ ] Set up database backups
-   [ ] Configure reverse proxy (nginx)

### Environment Setup

```env
NODE_ENV=production
PORT=5000
DB_TYPE=postgres
POSTGRES_HOST=your-prod-host
POSTGRES_PORT=5432
POSTGRES_DB=usg_db
POSTGRES_USER=usg_user
POSTGRES_PASSWORD=secure-password
POSTGRES_SSL=true
```

---

## 🤝 Contributing

### Adding a New Endpoint

1. Create route handler in `src/routes/`
2. Add validation schema in `src/middleware/validation.js`
3. Apply appropriate middleware (auth, validation)
4. Add Swagger documentation
5. Write tests
6. Update this README if needed

See [MIDDLEWARE_GUIDE.md](MIDDLEWARE_GUIDE.md) and [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for details.

### Adding a New Repository

1. Create repository class in `src/db/repositories/`
2. Extend `BaseRepository`
3. Implement domain-specific methods
4. Add to `src/db/index.js`
5. Write tests

---

## 🆘 Troubleshooting

### Server won't start

-   Check `.env` file exists and has correct values
-   Verify database credentials
-   Check if port is already in use: `netstat -ano | findstr :5000`
-   Check environment validation errors in console

### Database connection fails

-   Verify database is running
-   Check credentials in `.env`
-   For Supabase: verify URL and service key
-   For PostgreSQL: check host, port, and SSL settings

### Authentication errors

-   Verify JWT token is valid
-   Check token hasn't expired
-   Ensure token is sent in `Authorization` header
-   Format: `Authorization: Bearer <token>`

### Tests failing

-   Run `npm install` to ensure dependencies are installed
-   Check if test database is configured
-   Clear Jest cache: `npm test -- --clearCache`
-   Check for ES module issues

---

## 📝 License

MIT License - See LICENSE file for details

---

## 📞 Support

For questions or issues:

1. Check the documentation files in `backend/`
2. Review the API documentation at `/api/docs`
3. Check existing issues on GitHub
4. Contact the development team

---

## ✨ What's New

### Recent Improvements (2024)

✅ Database abstraction layer with factory pattern
✅ Comprehensive input validation with Zod
✅ Centralized error handling
✅ JWT authentication and authorization
✅ Rate limiting for all endpoints
✅ Request logging with Morgan
✅ Interactive API documentation with Swagger
✅ Jest testing framework with 70+ tests
✅ Complete documentation guides

See [BACKEND_IMPROVEMENTS.md](BACKEND_IMPROVEMENTS.md) for full details.

---

## 🎯 Next Steps

### Recommended

1. Review [MIDDLEWARE_GUIDE.md](MIDDLEWARE_GUIDE.md) to understand security features
2. Explore API at `http://localhost:5000/api/docs`
3. Read [DATABASE_SETUP.md](DATABASE_SETUP.md) for database options
4. Check [TESTING_GUIDE.md](TESTING_GUIDE.md) if contributing code

### Optional Enhancements

-   Add repository tests for complete coverage
-   Implement integration tests for all routes
-   Set up CI/CD pipeline
-   Add monitoring and analytics
-   Implement caching layer

---

**Happy coding! 🚀**

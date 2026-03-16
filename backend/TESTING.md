# Backend Testing Guide

## 1. Start the Server

```bash
cd backend
npm start
```

Or:
```bash
node server.js
```

The server will run on **http://localhost:5000**

## 2. Test Database Connection

Open your browser or use curl:
```bash
curl http://localhost:5000/test-db
```

Expected response:
```json
{
  "success": true,
  "time": { "now": "2024-..." }
}
```

## 3. Test Root Route

```bash
curl http://localhost:5000/
```

Should return: "Student Command Center API is running"

## 4. Test User Registration (Public Route)

```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 5. Test User Login (Public Route)

```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the token** from the response - you'll need it for protected routes!

## 6. Test Protected Routes

Replace `YOUR_TOKEN_HERE` with the token from login:

### Test Tasks
```bash
# Create Task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "task": "Complete project",
    "due_date": "2024-12-31"
  }'

# Get Tasks
curl http://localhost:5000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Task
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "completed": true
  }'
```

### Test Assignments
```bash
# Create Assignment
curl -X POST http://localhost:5000/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Math Homework",
    "course": "Calculus",
    "deadline": "2024-12-20",
    "priority": "High",
    "status": "Pending"
  }'

# Get Assignments
curl http://localhost:5000/assignments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Job Applications
```bash
# Create Job Application
curl -X POST http://localhost:5000/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "company": "Tech Corp",
    "role": "Software Engineer",
    "applied_date": "2024-12-01",
    "status": "Applied",
    "notes": "Great opportunity"
  }'

# Get Job Applications
curl http://localhost:5000/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 7. Using Postman or Thunder Client

1. **Base URL**: `http://localhost:5000`
2. **For protected routes**, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

## 8. Common Endpoints Summary

### Public Routes (No Auth)
- `POST /users` - Register
- `POST /users/login` - Login
- `GET /users` - Get all users
- `GET /` - Root
- `GET /test-db` - Test DB connection

### Protected Routes (Require Auth Token)
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

- `GET /assignments` - Get all assignments
- `GET /assignments/:id` - Get single assignment
- `POST /assignments` - Create assignment
- `PUT /assignments/:id` - Update assignment
- `DELETE /assignments/:id` - Delete assignment

- `GET /jobs` - Get all job applications
- `POST /jobs` - Create job application
- `PUT /jobs/:id` - Update job application
- `DELETE /jobs/:id` - Delete job application


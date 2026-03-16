# Postman API Testing Guide

## Prerequisites
- Make sure your server is running: `npm start` or `node backend/server.js`
- Server should be running on: `http://localhost:5000`
- Database should be connected (PostgreSQL)

---

## Step-by-Step Testing Guide

### **STEP 1: Test Database Connection** ✅

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/test-db`
- **Headers:** None needed
- **Body:** None

**Expected Response:**
```json
{
  "success": true,
  "time": {
    "now": "2024-01-15T10:30:00.000Z"
  }
}
```

**What to check:**
- Status code: `200 OK`
- Response shows current database time

---

### **STEP 2: Register a New User** 👤

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/users`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**What to check:**
- Status code: `201 Created`
- User ID is returned
- **VERIFY IN DATABASE:** Run this SQL query in pgAdmin or psql:
  ```sql
  SELECT * FROM users WHERE email = 'test@example.com';
  ```
  You should see the user with a hashed password.

---

### **STEP 3: Login to Get JWT Token** 🔐

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/users/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**IMPORTANT:** 
- **Copy the `token` value** - you'll need it for all protected routes!
- In Postman, you can save this token as an environment variable

**What to check:**
- Status code: `200 OK`
- Token is returned (long string)

---

### **STEP 4: Test Assignments Endpoints** 📝

#### **4a. Create Assignment**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/assignments`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE` (replace with token from Step 3)
- **Body (raw JSON):**
```json
{
  "title": "Math Homework",
  "course": "Calculus 101",
  "deadline": "2024-01-20",
  "priority": "High",
  "status": "Pending"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Math Homework",
  "course": "Calculus 101",
  "deadline": "2024-01-20",
  "priority": "High",
  "status": "Pending",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**VERIFY IN DATABASE:**
```sql
SELECT * FROM assignments WHERE user_id = 1;
```

---

#### **4b. Get All Assignments**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/assignments`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Math Homework",
    "course": "Calculus 101",
    "deadline": "2024-01-20",
    "priority": "High",
    "status": "Pending",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### **4c. Get Single Assignment**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/assignments/1` (use the ID from 4a)
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

---

#### **4d. Update Assignment**

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:5000/assignments/1`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body (raw JSON):**
```json
{
  "title": "Math Homework - Updated",
  "course": "Calculus 101",
  "deadline": "2024-01-25",
  "priority": "Medium",
  "status": "In Progress"
}
```

**VERIFY IN DATABASE:**
```sql
SELECT * FROM assignments WHERE id = 1;
```

---

#### **4e. Delete Assignment**

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/assignments/1`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response:**
```json
{
  "message": "Assignment deleted",
  "assignment": { ... }
}
```

**VERIFY IN DATABASE:**
```sql
SELECT * FROM assignments WHERE id = 1;
-- Should return no rows
```

---

### **STEP 5: Test Tasks Endpoints** ✅

#### **5a. Create Task**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/tasks`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body (raw JSON):**
```json
{
  "task": "Complete project documentation",
  "due_date": "2024-01-18"
}
```

**VERIFY IN DATABASE:**
```sql
SELECT * FROM tasks WHERE user_id = 1;
```

---

#### **5b. Get All Tasks**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

---

#### **5c. Mark Task as Complete**

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:5000/tasks/1` (use task ID from 5a)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body (raw JSON):**
```json
{
  "completed": true
}
```

**VERIFY IN DATABASE:**
```sql
SELECT * FROM tasks WHERE id = 1;
-- Check that completed = true
```

---

#### **5d. Delete Task**

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/tasks/1`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

---

### **STEP 6: Test Jobs Endpoints** 💼

#### **6a. Create Job Application**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/jobs`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body (raw JSON):**
```json
{
  "company": "Tech Corp",
  "role": "Software Engineer",
  "applied_date": "2024-01-10",
  "status": "Applied",
  "notes": "Applied through company website"
}
```

**VERIFY IN DATABASE:**
```sql
SELECT * FROM job_applications WHERE user_id = 1;
```

---

#### **6b. Get All Jobs**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/jobs`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

---

#### **6c. Update Job Application**

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:5000/jobs/1` (use job ID from 6a)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body (raw JSON):**
```json
{
  "company": "Tech Corp",
  "role": "Software Engineer",
  "applied_date": "2024-01-10",
  "status": "Interview Scheduled",
  "notes": "Interview on Jan 25th"
}
```

**VERIFY IN DATABASE:**
```sql
SELECT * FROM job_applications WHERE id = 1;
-- Check that status = 'Interview Scheduled'
```

---

#### **6d. Delete Job Application**

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/jobs/1`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

---

## 🎯 Quick Database Verification Queries

Run these in pgAdmin or psql to verify all data:

```sql
-- Check users
SELECT id, name, email, created_at FROM users;

-- Check assignments
SELECT * FROM assignments;

-- Check tasks
SELECT * FROM tasks;

-- Check job applications
SELECT * FROM job_applications;
```

---

## 🔧 Postman Tips

### **Setting up Environment Variables:**

1. Click the gear icon (⚙️) in top right
2. Click "Add" to create new environment
3. Add variable: `token` = (paste your JWT token)
4. Add variable: `base_url` = `http://localhost:5000`
5. In requests, use: `{{base_url}}/assignments` and `{{token}}`

### **Authorization Tab:**
- Instead of manually adding Bearer token in Headers, use Postman's Authorization tab
- Select "Bearer Token" type
- Paste your token there
- Postman will automatically add it to headers

---

## ❌ Common Errors & Solutions

1. **401 Unauthorized**
   - Token expired or missing
   - Solution: Login again to get new token

2. **400 Bad Request**
   - Missing required fields
   - Check request body matches expected format

3. **404 Not Found**
   - Wrong URL or resource doesn't exist
   - Check the ID in URL matches existing record

4. **500 Server Error**
   - Check server console for error messages
   - Verify database connection
   - Check database tables exist

---

## ✅ Testing Checklist

- [ ] Database connection test works
- [ ] User registration works
- [ ] User login returns token
- [ ] Can create assignment (data appears in DB)
- [ ] Can get all assignments
- [ ] Can update assignment (changes appear in DB)
- [ ] Can delete assignment (removed from DB)
- [ ] Can create task (data appears in DB)
- [ ] Can mark task complete (changes appear in DB)
- [ ] Can create job application (data appears in DB)
- [ ] Can update job application (changes appear in DB)

---

**Happy Testing! 🚀**


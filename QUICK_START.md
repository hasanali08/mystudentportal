# 🚀 Quick Start - Frontend Integration

## ✅ Your Frontend is Already Integrated!

Your code is **already working** with JWT tokens. Here's what happens:

---

## 🔐 Token Flow (Simple Explanation)

```
┌─────────────┐
│  1. LOGIN   │  User enters email/password
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  2. TOKEN   │  Backend returns JWT token
│   RECEIVED  │  Token saved to localStorage
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  3. STORED  │  Token in localStorage
│             │  Persists across page refreshes
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 4. REQUEST  │  User creates assignment/task/job
│             │  Frontend gets token from localStorage
│             │  Adds to header: Authorization: Bearer <token>
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 5. BACKEND  │  Backend validates token
│  VALIDATES  │  Extracts user_id from token
│             │  Processes request with user_id
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 6. SUCCESS  │  Data saved to database
│             │  Response returned to frontend
└─────────────┘
```

---

## 💻 How It Works in Code

### **Step 1: Login (Already Working)**
```javascript
// frontend/app/login/page.js
const response = await fetch('http://localhost:5000/users/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

const { token, user } = await response.json();
login(user, token); // ← Saves to localStorage
```

### **Step 2: Making Requests (Already Working)**
```javascript
// frontend/app/assignments/page.js
const { getAuthHeaders } = useAuth();

fetch('http://localhost:5000/assignments', {
  headers: getAuthHeaders() // ← Automatically includes token!
});
```

### **What `getAuthHeaders()` Does:**
```javascript
// Returns:
{
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

---

## 🎯 Real Example: Creating an Assignment

**User Action:**
1. User fills form: "Math Homework", "Calculus 101"
2. Clicks "Create Assignment"

**Frontend Code:**
```javascript
// AssignmentForm.js
const { getAuthHeaders } = useAuth();

fetch('http://localhost:5000/assignments', {
  method: 'POST',
  headers: getAuthHeaders(), // ← Token automatically added!
  body: JSON.stringify({
    title: "Math Homework",
    course: "Calculus 101"
  })
});
```

**What Gets Sent:**
```
POST http://localhost:5000/assignments
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Body:
  { "title": "Math Homework", "course": "Calculus 101" }
```

**Backend Processing:**
```javascript
// Backend middleware extracts token
const token = req.headers['authorization'].split(' ')[1];
const decoded = jwt.verify(token); // { id: 1, email: "user@example.com" }

// Backend route uses user_id from token
const user_id = req.user.id; // = 1 (from token!)

await pool.query(
  "INSERT INTO assignments (user_id, title, course) VALUES ($1, $2, $3)",
  [user_id, title, course] // user_id = 1 (from token, not from request!)
);
```

**Result:**
- Assignment saved with `user_id = 1` (from token)
- User doesn't need to send user_id - it's in the token!

---

## 🔍 Verify It's Working

### **1. Check Token Storage:**
- Open DevTools (F12)
- Application tab → Local Storage
- Look for `token` key

### **2. Check Token in Requests:**
- Open DevTools → Network tab
- Create an assignment
- Click on the request
- Check Headers → `Authorization: Bearer ...`

### **3. Check Database:**
```sql
SELECT * FROM assignments;
-- Should see your assignments with correct user_id
```

---

## 📝 Key Points

✅ **Token is automatically included** - You don't manually add it  
✅ **Token persists** - Stored in localStorage, survives refreshes  
✅ **Backend extracts user_id** - From token, not from request body  
✅ **Token expires in 7 days** - User will need to login again  
✅ **401 errors** - Automatically redirect to login  

---

## 🎉 You're Done!

Your frontend is **fully integrated**. The token system works automatically:

1. ✅ Login/Register pages work
2. ✅ Token is stored in localStorage
3. ✅ Token is included in all requests
4. ✅ Backend validates and uses token
5. ✅ Data is saved to database

**Just start your servers and test it!**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Then go to `http://localhost:3000` and start using the app! 🚀


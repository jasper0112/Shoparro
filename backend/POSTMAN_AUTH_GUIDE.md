# Postman Authentication Guide

## 🔐 How to Use JWT Authentication in Postman

### Step 1: Get a JWT Token

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "your-email@example.com",
    ...
  }
}
```

**Copy the `token` value!**

---

### Step 2: Use Token in Authenticated Requests

For any request that requires authentication (like `PUT /api/users/{id}`):

#### Method 1: Using Authorization Tab (Recommended)
1. Open your request in Postman
2. Go to the **"Authorization"** tab
3. Select **"Bearer Token"** from the Type dropdown
4. Paste your token in the Token field
5. Send the request

#### Method 2: Using Headers Tab
1. Go to the **"Headers"** tab
2. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer <your-token-here>`
   - ⚠️ **Important:** Include the word "Bearer" followed by a space before your token!

---

### Step 3: Register a New User (If Needed)

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "phone": "0412345678",
  "address": "123 Main St",
  "city": "Sydney",
  "postcode": "2000",
  "country": "Australia"
}
```

Then login with the same credentials to get a token.

---

## 📋 Protected Endpoints

These endpoints require authentication (JWT token):

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `PATCH /api/users/{id}/toggle-status` - Toggle user status
- All `/api/orders/**` endpoints
- All `/api/products/**` endpoints (if protected)

## 🔓 Public Endpoints (No Token Required)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login to get token
- `POST /api/users/register` - Alternative register endpoint
- `POST /api/users/login` - Alternative login endpoint

---

## ⚠️ Common Issues

### 403 Forbidden
- **Cause:** Missing or invalid token
- **Solution:** 
  1. Make sure you logged in and copied the token correctly
  2. Check that the token is in the format: `Bearer <token>`
  3. Token might be expired (valid for 24 hours)

### 401 Unauthorized
- **Cause:** Invalid credentials during login
- **Solution:** Check your email and password are correct

### Token Expired
- **Cause:** Token is older than 24 hours
- **Solution:** Login again to get a new token

---

## 💡 Pro Tips

1. **Save Token as Environment Variable:**
   - After login, copy the token
   - In Postman, go to Environments
   - Create variable: `jwt_token`
   - Use `{{jwt_token}}` in Authorization tab

2. **Auto-extract Token:**
   - In the login request, go to "Tests" tab
   - Add script:
   ```javascript
   if (pm.response.code === 200) {
       var jsonData = pm.response.json();
       pm.environment.set("jwt_token", jsonData.token);
   }
   ```
   - Then use `{{jwt_token}}` in other requests

3. **Token Format:**
   - Always use: `Bearer <token>`
   - Not just: `<token>`
   - The word "Bearer" is required!


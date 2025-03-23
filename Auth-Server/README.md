# Authentication API Documentation

## Base URL
`{{base_Url}}/api/auth`

## All authentication endpoints are prefixed with `/api/auth`

## Authentication Endpoints

### 1. Register User
**Endpoint**: `POST /api/auth/register`  
**Description**: Register a new user  
**Request Body**:
```json
{
    "username": "string (min 3 characters)",
    "email": "string (valid email)",
    "password": "string (min 6 characters)",
    "phone": "string",
    "role": "user | admin"
}
```
**Response**:
```json
{
    "error": false,
    "user": {
        "username": "string",
        "email": "string",
        "email_Verified": false,
        "phoneNumber_Verified": false,
        "role": "string"
    }
}
```

### 2. Login User
**Endpoint**: `POST /api/auth/login`  
**Description**: Authenticate user  
**Request Body**:
```json
{
    "email": "string",
    "password": "string"
}
```
**Response**:
```json
{
    "error": false,
    "user": {
        "username": "string",
        "email": "string",
        "role": "string"
    },
    "AccessToken": "string",
    "refreshToken": "string"
}
```

### 3. Verify Email OTP
**Endpoint**: `POST /api/auth/verifyotp`  
**Description**: Verify email with OTP  
**Headers**: `Authorization: Bearer {token}`  
**Request Body**:
```json
{
    "otp": "string"
}
```
**Response**:
```json
{
    "msg": "Email verification successful",
    "user": {
        "email_Verified": true
    }
}
```

### 4. Forgot Password
**Endpoint**: `POST /api/auth/forget-password`  
**Description**: Send password reset link  
**Request Body**:
```json
{
    "email": "string"
}
```
**Response**:
```json
{
    "error": false,
    "msg": "Link has been send to verified mail"
}
```

### 5. Reset Password
**Endpoint**: `POST /api/auth/reset-password`  
**Description**: Reset user password  
**Headers**: `Authorization: Bearer {token}`  
**Request Body**:
```json
{
    "password": "string"
}
```
**Response**:
```json
{
    "msg": "reset password successfully",
    "user": {
        "email": "string",
        "username": "string"
    }
}
```

### 6. Send SMS OTP
**Endpoint**: `POST /api/auth/send-sms`  
**Description**: Send OTP via SMS for phone verification  
**Request Body**:
```json
{
    "phone": "string"
}
```
**Response**:
```json
{
    "msg": "Sms sent successfully",
    "otp": "string"
}
```

### 7. Verify SMS OTP
**Endpoint**: `POST /api/auth/verify-smsotp`  
**Description**: Verify phone number with OTP  
**Headers**: `Authorization: Bearer {token}`  
**Request Body**:
```json
{
    "smsOtp": "string"
}
```
**Response**:
```json
{
    "error": false,
    "msg": "Sms verification successful",
    "updatedUser": {
        "phoneNumber_Verified": true
    }
}
```

### 8. Get User Profile
**Endpoint**: `GET /api/auth/user`  
**Description**: Get authenticated user profile  
**Headers**: `Authorization: Bearer {token}`  
**Response**:
```json
{
    "msg": "user fetched..",
    "data": {
        "username": "string",
        "email": "string",
        "role": "string"
    }
}
```

### 9. Get All Users (Admin Only)
**Endpoint**: `GET /api/auth/allUsers`  
**Description**: Get all users (requires admin role)  
**Headers**: `Authorization: Bearer {token}`  
**Response**:
```json
{
    "msg": "users fetched..",
    "data": [
        {
            "username": "string",
            "email": "string",
            "role": "string"
        }
    ]
}
```

### 10. Logout
**Endpoint**: `GET /api/auth/logout`  
**Description**: Logout user and clear tokens  
**Response**:
```json
{
    "error": false,
    "msg": "user logged out"
}
```

## Security Features
- Rate limiting implemented
- Helmet.js for security headers
- JWT-based authentication
- Role-based access control
- Input validation
- HTTP-only cookies
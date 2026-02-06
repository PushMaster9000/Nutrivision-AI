# Authentication System

Complete authentication system for Nutrivision-AI frontend with login, signup, and route protection.

## Components

### 1. **AuthPage.jsx**
Main authentication page with toggle between login and signup forms.

**Features:**
- Toggle between login and signup
- Professional UI with gradients
- Demo mode to bypass authentication
- Project branding

### 2. **LoginForm.jsx**
Handles user login with email and password.

**Features:**
- Email validation
- Password visibility toggle
- Remember me option
- Error handling
- Loading states

### 3. **SignupForm.jsx**
Handles user registration with validation.

**Features:**
- Full name, email, password fields
- Password confirmation validation
- Terms and conditions agreement
- Real-time validation feedback
- Error handling

### 4. **AuthContext.jsx**
React Context for managing global authentication state.

**Provides:**
- `user` - Current authenticated user object
- `token` - Authentication token
- `isAuthenticated` - Boolean flag
- `login()` - Login function
- `logout()` - Logout function
- `loading` - Loading state during auth check

### 5. **ProtectedRoute.jsx**
Route protection component to restrict access to authenticated users.

**Features:**
- Redirects unauthenticated users to /auth
- Shows loading state while checking authentication
- Wraps protected routes

## Setup Instructions

### 1. Import AuthProvider in App.jsx

```jsx
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      {/* Your routes here */}
    </AuthProvider>
  );
}
```

### 2. Setup Routes

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './pages/Dashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Update API Client

Ensure your API client (`api/client.js`) includes the auth token:

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### 4. Update Navbar for Logout

Add logout functionality to your Navbar:

```jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav>
      {user && (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}
```

## Backend Integration

Your backend should have these endpoints:

### POST /auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### POST /auth/signup
```json
Request:
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## Usage Examples

### Using useAuth Hook

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return <p>Welcome, {user.name}!</p>;
  }
  
  return <p>Please log in</p>;
}
```

### Protected API Calls

```jsx
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

function Dashboard() {
  const { token } = useAuth();

  const fetchData = async () => {
    try {
      // Token is automatically added by interceptor
      const response = await apiClient.get('/foods');
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Styling

The authentication pages use **Tailwind CSS** for styling. Make sure Tailwind is configured in your project:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## File Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── AuthPage.jsx      ← Main auth page
│   │   ├── LoginForm.jsx     ← Login form
│   │   ├── SignupForm.jsx    ← Signup form
│   │   └── AuthPage.css      ← Styles
│   └── ProtectedRoute.jsx    ← Route protection
├── context/
│   └── AuthContext.jsx       ← Auth state management
└── api/
    └── client.js             ← API client with token interceptor
```

## Features

✅ Complete login/signup flow
✅ Form validation
✅ Password visibility toggle
✅ Error handling and messages
✅ Loading states
✅ Token management
✅ Route protection
✅ Persistent login (localStorage)
✅ Professional UI with Tailwind CSS
✅ Demo mode for testing
✅ Responsive design

## Security Best Practices

⚠️ **Important Security Notes:**

1. **HTTPS Only**: Always use HTTPS in production
2. **Token Storage**: Consider using httpOnly cookies instead of localStorage for production
3. **Password**: Hash passwords on the backend (e.g., bcrypt)
4. **Token Refresh**: Implement token refresh logic for long-lived sessions
5. **CORS**: Configure CORS properly on your backend
6. **Rate Limiting**: Add rate limiting to prevent brute force attacks

Example with httpOnly cookies (for production):

```jsx
// In SignupForm/LoginForm
const response = await apiClient.post('/auth/login', { email, password });

// Backend should set:
// Set-Cookie: authToken=token; HttpOnly; Secure; SameSite=Strict

// Then access authenticated routes automatically
```

## Troubleshooting

### "No module named 'AuthContext'"
- Ensure AuthProvider wraps your entire app in App.jsx

### "Token not being sent to API"
- Check that apiClient has the interceptor configured
- Verify token is saved to localStorage

### Routes not protecting
- Make sure ProtectedRoute wraps the route
- Check that AuthProvider is at the root level

### Login not working
- Verify backend endpoints exist
- Check network tab in browser DevTools
- Ensure CORS is enabled on backend

## Next Steps

1. Implement backend auth endpoints
2. Test login/signup flow
3. Add "Forgot Password" functionality
4. Implement email verification
5. Add two-factor authentication (optional)
6. Setup password reset flow

---

**For questions or issues, check the backend README.md or contact the development team.**

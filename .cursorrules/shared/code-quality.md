# 🎖️ Code Quality Standards for RentIntel

## 🎯 Overview

These standards ensure our codebase remains maintainable, readable, and performant. Every piece of code should follow these principles to maintain consistency and quality across the project.

## 🏆 Core Principles

### 1. **Clean Code Philosophy**

#### Readability First
```typescript
// ❌ Poor readability
const u = users.filter(u => u.r === 'a' && u.s === 'active').map(u => ({
  id: u.id,
  n: u.name,
  e: u.email
}));

// ✅ Clear and readable
const activeAdminUsers = users
  .filter(user => user.role === 'admin' && user.status === 'active')
  .map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
```

#### Self-Documenting Code
```typescript
// ❌ Requires comments to understand
// Check if user can access admin features
const canAccess = u.role === 'admin' || (u.role === 'moderator' && u.permissions.includes('admin_read'));

// ✅ Self-explanatory
const hasAdminAccess = (user: User): boolean => {
  const isAdmin = user.role === 'admin';
  const isModeratorWithAdminPermissions = 
    user.role === 'moderator' && 
    user.permissions.includes('admin_read');
  
  return isAdmin || isModeratorWithAdminPermissions;
};
```

#### Single Responsibility Principle
```typescript
// ❌ Multiple responsibilities
const processUserData = (userData: any) => {
  // Validation
  if (!userData.email) throw new Error('Email required');
  
  // Transformation
  const user = {
    id: generateId(),
    email: userData.email.toLowerCase(),
    name: userData.name?.trim() || 'Unknown',
  };
  
  // Side effects
  analytics.track('user_created', user);
  cache.set(`user_${user.id}`, user);
  
  // API call
  return fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
};

// ✅ Single responsibility with clear separation
const validateUserData = (userData: UserInput): void => {
  if (!userData.email) {
    throw new ValidationError('Email is required');
  }
  // Additional validation
};

const transformUserData = (userData: UserInput): User => {
  return {
    id: generateId(),
    email: userData.email.toLowerCase(),
    name: userData.name?.trim() || 'Unknown',
    createdAt: new Date().toISOString(),
  };
};

const trackUserCreation = (user: User): void => {
  analytics.track('user_created', user);
};

const cacheUser = (user: User): void => {
  cache.set(`user_${user.id}`, user);
};

const createUser = async (userData: UserInput): Promise<User> => {
  validateUserData(userData);
  const user = transformUserData(userData);
  
  const response = await userService.create(user);
  
  trackUserCreation(user);
  cacheUser(user);
  
  return response;
};
```

### 2. **Error Handling Excellence**

#### Comprehensive Error Types
```typescript
// ✅ Proper error hierarchy
abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
  
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;
  
  constructor(
    message: string,
    public readonly field?: string,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }
}

class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly isOperational = true;
  
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
  }
}

class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly isOperational = true;
  
  constructor(action?: string) {
    super(`Unauthorized${action ? ` to ${action}` : ''}`);
  }
}
```

#### Error Handling Patterns
```typescript
// ✅ Consistent error handling
const handleApiError = (error: unknown): never => {
  if (error instanceof AppError) {
    throw error;
  }
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    switch (status) {
      case 400:
        throw new ValidationError(message);
      case 401:
        throw new UnauthorizedError();
      case 404:
        throw new NotFoundError('Resource');
      default:
        throw new AppError(message || 'An unexpected error occurred');
    }
  }
  
  throw new AppError('An unexpected error occurred');
};

// ✅ Service layer error handling
class UserService {
  async getUser(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      validateUserData(userData);
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; // Re-throw validation errors
      }
      handleApiError(error);
    }
  }
}
```

### 3. **Performance Best Practices**

#### Efficient Data Structures
```typescript
// ❌ Inefficient lookups
const findUserByEmail = (users: User[], email: string): User | undefined => {
  return users.find(user => user.email === email); // O(n) lookup
};

// ✅ Use Map for frequent lookups
class UserManager {
  private usersByEmail = new Map<string, User>();
  private usersById = new Map<string, User>();
  
  addUser(user: User): void {
    this.usersByEmail.set(user.email, user);
    this.usersById.set(user.id, user);
  }
  
  findByEmail(email: string): User | undefined {
    return this.usersByEmail.get(email); // O(1) lookup
  }
  
  findById(id: string): User | undefined {
    return this.usersById.get(id); // O(1) lookup
  }
}
```

#### Memory Management
```typescript
// ✅ Proper cleanup patterns
class ComponentWithSubscription {
  private abortController = new AbortController();
  
  async componentDidMount() {
    // Use AbortController for fetch requests
    try {
      const response = await fetch('/api/data', {
        signal: this.abortController.signal
      });
      // Handle response
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
      }
    }
  }
  
  componentWillUnmount() {
    // Cleanup
    this.abortController.abort();
  }
}

// ✅ React hooks cleanup
const useDataFetching = (url: string) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          signal: abortController.signal
        });
        setData(await response.json());
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Handle actual errors
        }
      }
    };
    
    fetchData();
    
    return () => {
      abortController.abort();
    };
  }, [url]);
  
  return data;
};
```

## 🎨 Code Style Standards

### Naming Conventions

#### Variables and Functions
```typescript
// ✅ Clear, descriptive names
const activeUserCount = users.filter(user => user.isActive).length;
const calculateMonthlyRevenue = (subscriptions: Subscription[]) => { /* */ };
const isUserEligibleForPremium = (user: User): boolean => { /* */ };

// ❌ Ambiguous names
const count = users.filter(u => u.active).length;
const calc = (subs: any[]) => { /* */ };
const check = (u: any) => { /* */ };
```

#### Constants
```typescript
// ✅ Descriptive constant names
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;
const API_TIMEOUT_MS = 5000;

// API endpoints
const API_ENDPOINTS = {
  USERS: '/api/users',
  SUBSCRIPTIONS: '/api/subscriptions',
  REPORTS: '/api/reports',
} as const;

// Error messages
const ERROR_MESSAGES = {
  VALIDATION: {
    EMAIL_REQUIRED: 'Email address is required',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  },
  NETWORK: {
    CONNECTION_FAILED: 'Unable to connect to server',
    TIMEOUT: 'Request timed out',
  },
} as const;
```

#### File and Directory Names
```typescript
// ✅ Consistent file naming
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   └── user/
│       ├── UserProfile.tsx
│       ├── UserList.tsx
│       └── UserForm.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── services/
│   ├── authService.ts
│   ├── userService.ts
│   └── subscriptionService.ts
└── utils/
    ├── dateUtils.ts
    ├── validationUtils.ts
    └── formatUtils.ts
```

### Function Design

#### Pure Functions Preference
```typescript
// ✅ Pure functions - predictable and testable
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

const calculateTax = (amount: number, rate: number): number => {
  return amount * rate;
};

const sortUsersByName = (users: User[]): User[] => {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
};

// ❌ Impure functions - harder to test and reason about
let currentUser: User | null = null;

const getFormattedUserName = (): string => {
  return currentUser ? currentUser.name.toUpperCase() : 'Guest';
};
```

#### Function Size and Complexity
```typescript
// ✅ Small, focused functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const validateUserInput = (input: UserInput): ValidationResult => {
  const errors: string[] = [];
  
  if (!validateEmail(input.email)) {
    errors.push('Invalid email format');
  }
  
  if (!validatePassword(input.password)) {
    errors.push('Password must be at least 8 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ❌ Large, complex function
const processUser = (input: any) => {
  // 50+ lines of validation, transformation, and side effects
  // Hard to understand, test, and maintain
};
```

## 🧪 Testing Standards

### Test Structure
```typescript
// ✅ Comprehensive test structure
describe('UserService', () => {
  let userService: UserService;
  let mockApiClient: jest.Mocked<ApiClient>;
  
  beforeEach(() => {
    mockApiClient = createMockApiClient();
    userService = new UserService(mockApiClient);
  });
  
  describe('getUser', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser: User = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockApiClient.get.mockResolvedValue({ data: expectedUser });
      
      // Act
      const result = await userService.getUser(userId);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockApiClient.get).toHaveBeenCalledWith(`/users/${userId}`);
    });
    
    it('should throw NotFoundError when user not found', async () => {
      // Arrange
      const userId = '999';
      mockApiClient.get.mockRejectedValue(new AxiosError('Not found', '404'));
      
      // Act & Assert
      await expect(userService.getUser(userId)).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Test Coverage Requirements
```typescript
// ✅ Test all critical paths
describe('calculateDiscount', () => {
  it.each([
    [100, 0.1, 10],
    [250, 0.15, 37.5],
    [1000, 0.2, 200],
  ])('should calculate %s * %s = %s', (amount, rate, expected) => {
    expect(calculateDiscount(amount, rate)).toBe(expected);
  });
  
  it('should handle zero amount', () => {
    expect(calculateDiscount(0, 0.1)).toBe(0);
  });
  
  it('should handle zero rate', () => {
    expect(calculateDiscount(100, 0)).toBe(0);
  });
  
  it('should throw error for negative amounts', () => {
    expect(() => calculateDiscount(-100, 0.1)).toThrow(ValidationError);
  });
});
```

## 📈 Performance Monitoring

### Code Performance
```typescript
// ✅ Performance-conscious code
class PerformanceTracker {
  private static measurements = new Map<string, number[]>();
  
  static measure<T>(operation: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    if (!this.measurements.has(operation)) {
      this.measurements.set(operation, []);
    }
    this.measurements.get(operation)!.push(duration);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation: ${operation} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  
  static getAverageTime(operation: string): number {
    const times = this.measurements.get(operation) || [];
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
}

// Usage
const result = PerformanceTracker.measure('user-search', () => {
  return searchUsers(query);
});
```

### Bundle Size Optimization
```typescript
// ✅ Lazy loading for routes
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));
const UserDashboard = lazy(() => import('@/components/user/UserDashboard'));

// ✅ Tree-shaking friendly imports
import { debounce } from 'lodash-es'; // Import specific function
// ❌ import * as _ from 'lodash'; // Imports entire library

// ✅ Dynamic imports for large libraries
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};
```

## 📋 Code Review Checklist

### Before Submitting
- [ ] Code follows TypeScript standards (no `any` types)
- [ ] Functions are small and focused
- [ ] Error handling is comprehensive
- [ ] Performance considerations addressed
- [ ] Tests cover critical paths
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Security best practices followed

### Review Criteria
- [ ] **Readability**: Code is self-documenting
- [ ] **Maintainability**: Easy to modify and extend
- [ ] **Performance**: No obvious performance issues
- [ ] **Security**: No security vulnerabilities
- [ ] **Testing**: Adequate test coverage
- [ ] **Standards**: Follows project conventions

## 🎯 Quality Metrics

### Code Quality Targets
- **TypeScript Coverage**: 100%
- **Test Coverage**: >80%
- **Code Complexity**: Cyclomatic complexity <10
- **Function Length**: <50 lines
- **File Length**: <500 lines
- **Dependency Count**: Minimize external dependencies

### Automated Quality Checks
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "quality": "npm run lint && npm run type-check && npm run test:coverage"
  }
}
```

---

**Remember**: Quality code is not just about working functionality—it's about creating sustainable, maintainable systems that can evolve with our business needs. 
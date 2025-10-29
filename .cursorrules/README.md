# 🎯 RentIntel Cursor Rules

This directory contains comprehensive coding standards and rules for the RentIntel project using Cursor AI. These rules ensure consistent, maintainable, and high-quality code across the entire application.

## 📁 Structure

```
.cursorrules/
├── README.md                 # This file - overview and guidelines
├── frontend/                 # Frontend-specific rules
│   ├── react.md             # React component standards
│   ├── nextjs.md            # Next.js specific rules
│   ├── typescript.md        # TypeScript guidelines
│   ├── styling.md           # CSS/Bootstrap standards
│   └── testing.md           # Frontend testing rules
├── shared/                   # Shared standards
│   ├── code-quality.md      # General code quality standards
│   ├── git.md               # Git workflow and commit standards
│   └── architecture.md      # Overall architecture guidelines
└── examples/                 # Code examples and templates
    ├── components/           # Component examples
    ├── hooks/               # Hook examples
    ├── services/            # Service examples
    └── utils/               # Utility examples
```

## 🚀 Quick Start

1. **Read the Overview**: Start with this README
2. **Frontend Rules**: Check `frontend/` for React/Next.js standards
3. **Code Quality**: Review `shared/code-quality.md` for general standards
4. **Examples**: Use `examples/` for reference implementations

## 📋 Core Principles

### 1. **Type Safety First**
- Zero tolerance for `any` types
- Strict TypeScript configuration
- Proper interface definitions
- Generic type usage where appropriate

### 2. **Clean Architecture**
- Feature-based folder structure
- Separation of concerns
- Dependency injection
- Single responsibility principle

### 3. **Performance & Security**
- Optimized bundle sizes
- Proper error handling
- Security best practices
- Accessibility compliance

### 4. **Developer Experience**
- Consistent naming conventions
- Comprehensive documentation
- Automated testing
- Clear error messages

## 🎨 Code Style Standards

### Naming Conventions
- **Files**: `camelCase.ts`, `PascalCase.tsx`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Import Order
```typescript
// 1. React/Next.js imports
import React from 'react';
import { NextPage } from 'next';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { API_ROUTES } from '@/constants/routes';

// 4. Relative imports
import './Component.css';
```

## 🛠️ Tools Integration

### ESLint Configuration
- Strict TypeScript rules
- React hooks rules
- Import/export rules
- Accessibility rules

### Prettier Configuration
- 2-space indentation
- Single quotes
- Trailing commas
- Semicolons

### Husky Hooks
- Pre-commit: Lint and format
- Pre-push: Type check and test
- Commit message: Conventional commits

## 📊 Quality Metrics

### Code Quality Targets
- **TypeScript Coverage**: 100%
- **Test Coverage**: >80%
- **Performance Score**: >90
- **Accessibility Score**: >95

### Monitoring
- Bundle size tracking
- Performance monitoring
- Error rate tracking
- User experience metrics

## 🔄 Workflow

### Development Process
1. **Feature Branch**: Create from `develop`
2. **Development**: Follow coding standards
3. **Testing**: Write comprehensive tests
4. **Review**: Peer code review
5. **Integration**: Merge to `develop`
6. **Deployment**: Deploy to staging/production

### Code Review Checklist
- [ ] Follows TypeScript standards
- [ ] Proper error handling
- [ ] Performance optimizations
- [ ] Accessibility compliance
- [ ] Security considerations
- [ ] Test coverage
- [ ] Documentation updated

## 📚 Resources

### Internal Documentation
- [Frontend Rules](./frontend/README.md)
- [Code Quality Standards](./shared/code-quality.md)
- [Architecture Guidelines](./shared/architecture.md)

### External References
- [React Best Practices](https://react.dev/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🆘 Getting Help

### Common Issues
1. **Type Errors**: Check TypeScript rules
2. **Import Errors**: Verify path mapping
3. **Linting Issues**: Check ESLint configuration
4. **Performance**: Review optimization guidelines

### Support Channels
- Internal documentation
- Code review feedback
- Team knowledge sharing
- External resources

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: RentIntel Development Team 
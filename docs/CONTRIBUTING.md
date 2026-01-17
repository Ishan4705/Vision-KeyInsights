# Development Guidelines for Vision KeyInsights

**Internal Development Guide**

This document outlines development standards and best practices for the Vision KeyInsights team.

## 🤝 Development Activities

- 🐛 Fix bugs
- 💡 Implement new features
- 📝 Update documentation
- 🔧 Code improvements
- 🎨 UI/UX enhancements
- ✅ Write tests

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ishan4705/Vision-KeyInsights.git
cd Vision-KeyInsights
```

### 2. Set Up Development Environment

Follow the [Getting Started Guide](./GETTING_STARTED.md) to set up your local environment.

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

## 📝 Code Style

### TypeScript/JavaScript

- Use TypeScript for all new files
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for complex functions

**Example:**
```typescript
/**
 * Generates an optimized prompt for thumbnail creation
 * @param userInput - User's description of the thumbnail
 * @param hasRefImage - Whether a reference image is provided
 * @returns Optimized prompt string
 */
async function generatePrompt(
  userInput: string, 
  hasRefImage: boolean
): Promise<string> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Follow naming conventions: `PascalCase` for components
- Keep components small and focused
- Use TypeScript interfaces for props

**Example:**
```typescript
interface ThumbnailCardProps {
  thumbnail: Thumbnail;
  onDelete?: (id: number) => void;
}

export function ThumbnailCard({ thumbnail, onDelete }: ThumbnailCardProps) {
  // Implementation
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Follow mobile-first approach
- Use consistent spacing scale
- Extract repeated patterns to components

### File Organization

```
- Components: `components/` or `app/_components/`
- Pages: `app/(routes)/`
- API Routes: `app/api/`
- Utilities: `lib/`
- Types: `types/` or inline with files
- Tests: `__tests__/` or `*.test.ts` alongside files
```

## 🧪 Testing

### Running Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### Writing Tests (Future)

When the test suite is added:

```typescript
// Example: __tests__/utils/generatePrompt.test.ts
import { generatePrompt } from '@/lib/utils';

describe('generatePrompt', () => {
  it('should generate prompt without reference image', async () => {
    const result = await generatePrompt('React Tutorial', false);
    expect(result).toContain('React Tutorial');
  });
});
```

## 📋 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Test additions/updates
- `chore` - Maintenance tasks

**Examples:**
```bash
feat(thumbnail): add batch generation support

fix(auth): resolve sign-in redirect issue

docs(api): update API reference for new endpoints

refactor(database): optimize thumbnail queries
```

### Commit Best Practices

- Write clear, concise commit messages
- One logical change per commit
- Reference issue numbers when applicable
- Keep commits focused and atomic

## 🔀 Pull Request Process

### 1. Ensure Your Branch is Up to Date

```bash
git fetch origin
git rebase origin/main
```

### 2. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template

### 4. PR Title Format

```
<type>: <description>

feat: Add batch thumbnail generation
fix: Resolve loading state bug in ThumbnailList
docs: Update deployment guide
```

### 5. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Fixes #123

## Testing
- [ ] Tested locally
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive on mobile


### 6. Code Review

- Respond to feedback promptly
- Make requested changes
- Push updates to same branch
- Request re-review when ready

## 🐛 Bug Reports

### Before Submitting

- Check existing issues
- Verify bug in latest version
- Collect reproduction steps

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Screenshots, mockups, examples

**Are you willing to submit a PR?**
Yes/No
```

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep docs up to date with code changes

### Documentation Locations

- API docs: `docs/API_REFERENCE.md`
- User guides: `docs/FEATURES.md`
- Architecture: `docs/ARCHITECTURE.md`
- Setup: `docs/GETTING_STARTED.md`

## 🎯 Priority Labels

Issues and PRs use these labels:

- `critical` - Urgent issues
- `high-priority` - Important features/fixes
- `good-first-issue` - Great for newcomers
- `help-wanted` - Community contributions welcome
- `enhancement` - New features
- `bug` - Bug reports
- `documentation` - Doc improvements

## ✅ Review Checklist

Before submitting PR, ensure:

- [ ] Code follows style guidelines
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Builds successfully
- [ ] Works on mobile
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main





## 📞 Getting Help

- 💬 GitHub Discussions (coming soon)
- 📧 Create an issue with the `question` label
- 📖 Check the [documentation](./README.md)



---

**Last Updated:** January 17, 2026

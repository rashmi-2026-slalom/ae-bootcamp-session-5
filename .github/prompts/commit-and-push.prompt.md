---
description: "Analyze changes, generate commit message, and push to feature branch"
---

# Commit and Push Changes

Analyze workspace changes, generate a conventional commit message, and push to the specified feature branch.

## Instructions

### Prerequisites Check

**If the current step includes required UI workflow:**
- Verify that `/run-ui-tests` has been executed successfully in the current chat session, OR
- Run UI tests now: `npm run test:ui --workspace=frontend`
- Ensure UI tests are passing before committing

### Required Input

Branch name: `${input:branch-name:Enter feature branch name (e.g., feature/add-todo-api)}`

**CRITICAL**: Branch name is REQUIRED. If not provided, ask the user for it before proceeding.

### Step 1: Analyze Changes

Review all changes in the workspace:
```bash
git status
git diff
```

Identify:
- Files modified
- Features added or fixed
- Tests written or updated
- Documentation changes

### Step 2: Generate Commit Message

Create a descriptive commit message using **conventional commit format** (see Git Workflow in `.github/copilot-instructions.md`):

**Format**: `<type>: <description>`

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding or updating tests
- `refactor:` - Code restructuring without behavior change
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

**Examples**:
- `feat: add todo creation endpoint with validation`
- `test: add unit tests for todo API endpoints`
- `fix: resolve todo toggle state bug`
- `refactor: extract todo validation logic`

### Step 3: Create or Switch to Feature Branch

**If branch doesn't exist:**
```bash
git checkout -b ${input:branch-name}
```

**If branch exists:**
```bash
git checkout ${input:branch-name}
```

### Step 4: Stage All Changes

Stage all modified and new files:
```bash
git add .
```

Verify staged changes:
```bash
git status
```

### Step 5: Commit with Generated Message

Commit with the conventional commit message:
```bash
git commit -m "<generated-message>"
```

### Step 6: Push to Feature Branch

Push to the specified branch:
```bash
git push origin ${input:branch-name}
```

**CRITICAL**: 
- ❌ DO NOT push to `main` branch
- ❌ DO NOT push to any branch other than the user-provided branch name
- ✅ ONLY push to `${input:branch-name}`

### Step 7: Confirm Success

Report:
- ✅ Branch name used
- ✅ Commit message generated
- ✅ Files committed (count)
- ✅ Push status (success/failure)

## Success Indicators

- ✅ Changes analyzed and summarized
- ✅ Conventional commit message generated
- ✅ All changes staged with `git add .`
- ✅ Changes committed to feature branch
- ✅ Changes pushed to remote feature branch
- ❌ NO commits to main branch

## Error Handling

**If branch name not provided:**
- Stop and ask user for branch name
- Do not proceed without it

**If UI tests required but not run:**
- Warn user that UI tests should be run first
- Offer to run them before committing

**If push fails:**
- Report the error
- Check if remote branch exists
- Suggest `git push --set-upstream origin ${input:branch-name}` if needed

## References

- Git Workflow section in `.github/copilot-instructions.md` for conventional commit format
- Workflow Utilities section in `.github/copilot-instructions.md` for branch strategies

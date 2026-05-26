---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
---

# Execute Step Instructions

Execute the activities from the current step in the main GitHub exercise issue, following TDD principles.

## Instructions

You are now in **tdd-developer** agent mode. Follow these steps systematically:

### Step 1: Locate the Exercise Issue

If the user provided an issue number: `${input:issue-number:Enter issue number (or leave blank to auto-detect)}`

If no issue number was provided:
1. Use gh CLI to find the main exercise issue (title contains "Exercise:"):
   ```bash
   gh issue list --state open
   ```
2. Look for the issue with "Exercise:" in the title

### Step 2: Get Issue Content with Comments

Retrieve the full issue including all step instructions:
```bash
gh issue view <issue-number> --comments
```

### Step 3: Parse the Latest Step

1. Identify the most recent step comment (e.g., "# Step 5-1:")
2. Extract all `:keyboard: Activity:` sections from that step
3. Note any specific requirements or constraints

### Step 4: Execute Activities Systematically

For each activity in the step:

1. **Follow TDD Principles**:
   - Write tests FIRST for new features (RED phase)
   - Implement minimal code to pass tests (GREEN phase)
   - Refactor while keeping tests green (REFACTOR phase)

2. **Implement the Activity**:
   - Make incremental changes
   - Run tests frequently to validate
   - Document findings in `.github/memory/scratch/working-notes.md`

3. **Scope Boundaries** (CRITICAL):
   - ✅ Write and run unit tests (Jest, React Testing Library)
   - ✅ Write and run integration tests (Jest + Supertest)
   - ❌ DO NOT create Playwright UI tests (use `/create-ui-tests` instead)
   - ❌ DO NOT run Playwright UI tests (use `/run-ui-tests` instead)

4. **Test Coverage**:
   - Backend API changes → Write Jest tests FIRST
   - Frontend components → Write React Testing Library tests FIRST
   - Run appropriate test suites after implementation

### Step 5: Validate Completion

After completing all activities:

1. Run unit and integration tests to ensure they pass:
   ```bash
   npm test
   ```

2. DO NOT commit or push changes (use `/commit-and-push` instead)

### Step 6: Provide Next Commands

Based on the step requirements, recommend the appropriate workflow:

**If the current step requires UI workflow:**
```
Next steps:
1. Run: /create-ui-tests
2. Then: /run-ui-tests
3. Finally: /validate-step {step-number}
```

**If UI workflow is NOT required:**
```
Next step:
1. Run: /validate-step {step-number}
```

**IMPORTANT**: Never recommend `/validate-step` before required UI prompts (`/create-ui-tests` and `/run-ui-tests`)

## Success Indicators

- ✅ All activities from the step completed
- ✅ Unit and integration tests passing
- ✅ Changes documented in working notes
- ✅ Clear next steps provided (including UI prompts if needed)
- ❌ NO commits or pushes made (that's `/commit-and-push` responsibility)
- ❌ NO Playwright UI tests created or run (that's `/create-ui-tests` and `/run-ui-tests` responsibility)

## References

- Workflow Utilities section in `.github/copilot-instructions.md` for gh CLI commands
- Testing Scope section in `.github/copilot-instructions.md` for TDD approach
- Agent Usage section in `.github/copilot-instructions.md` for scope boundaries

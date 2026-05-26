---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
---

# Validate Step Completion

Validate that all success criteria for the specified step have been met by checking the workspace state against the step's requirements.

## Instructions

You are now in **code-reviewer** agent mode. Follow these steps to validate completion:

### Required Input

Step number: `${input:step-number:Enter step number (e.g., 5-0, 5-1)}`

**CRITICAL**: Step number is REQUIRED. Format should be like "5-0", "5-1", "5-2", etc.

### Step 1: Locate the Exercise Issue

Use gh CLI to find the main exercise issue (title contains "Exercise:"):
```bash
gh issue list --state open
```

Look for the issue with "Exercise:" in the title.

### Step 2: Get Full Issue Content

Retrieve the issue with all comments:
```bash
gh issue view <issue-number> --comments
```

### Step 3: Find the Specified Step

Search through the issue content to find:
```
# Step ${input:step-number}:
```

Extract the full step content including:
- Step title and description
- All activities (`:keyboard: Activity:` sections)
- **Success Criteria** section

### Step 4: Extract Success Criteria

Locate the "Success Criteria" section within the step. This typically includes checkpoints like:
- [ ] Tests passing
- [ ] Files created or modified
- [ ] Specific functionality working
- [ ] Code quality requirements met
- [ ] Documentation updated

### Step 5: Check Each Criterion

For each success criterion:

1. **Understand the Requirement**:
   - What does this criterion expect?
   - What files or functionality need to exist?

2. **Check Workspace State**:
   - Run relevant tests if criterion mentions test coverage
   - Check file existence and content if criterion mentions files
   - Review code implementation if criterion mentions functionality
   - Run linting if criterion mentions code quality

3. **Validate Completion**:
   - ✅ Criterion met - provide evidence
   - ⚠️ Partially met - explain what's missing
   - ❌ Not met - provide specific guidance to complete

### Step 6: Report Completion Status

Provide a clear summary:

```
**Step ${input:step-number} Validation**

**Success Criteria:**

✅ Criterion 1: [Description]
   - Evidence: [What was checked]
   - Status: Complete

⚠️ Criterion 2: [Description]
   - Evidence: [What was checked]
   - Status: Partially complete
   - Missing: [What needs to be done]

❌ Criterion 3: [Description]
   - Evidence: [What was checked]
   - Status: Incomplete
   - Action needed: [Specific guidance]

**Overall Status:** [X/Y criteria met]

**Next Steps:**
[Specific actions to complete remaining criteria, if any]
```

### Step 7: Provide Guidance

If any criteria are incomplete:
- Provide specific, actionable guidance
- Reference relevant files or commands
- Suggest running specific tests or checks
- Point to documentation if helpful

If all criteria are met:
- Confirm step completion
- Suggest using `/commit-and-push` if changes haven't been committed
- Indicate readiness to move to the next step

## Validation Checks by Type

### Test Coverage Criteria
```bash
# Backend tests
cd packages/backend && npm test

# Frontend tests
cd packages/frontend && npm test

# UI tests (if required)
cd packages/frontend && npm run test:ui
```

### File Existence Criteria
```bash
# Check if files exist
ls -la <file-path>

# Review file content
cat <file-path>
```

### Code Quality Criteria
```bash
# Run linting
npm run lint
```

### Functionality Criteria
- Review implementation code
- Check that features work as described
- Verify API endpoints exist and return expected data
- Validate UI components render and behave correctly

## Success Indicators

- ✅ Step number parsed correctly
- ✅ Exercise issue found
- ✅ Step content and success criteria extracted
- ✅ Each criterion checked against workspace state
- ✅ Clear completion status provided
- ✅ Specific guidance given for incomplete criteria
- ✅ Evidence provided for each validation

## Error Handling

**If step number not provided:**
- Stop and ask user for step number
- Explain the required format (e.g., "5-0", "5-1")

**If step not found in issue:**
- Report which steps are available
- Ask user to verify step number

**If success criteria section missing:**
- Report that the step doesn't have explicit success criteria
- Suggest validating based on activity completion

## References

- Workflow Utilities section in `.github/copilot-instructions.md` for gh CLI commands
- Testing Guidelines in `docs/testing-guidelines.md` for test validation
- Workflow Patterns in `docs/workflow-patterns.md` for validation approaches

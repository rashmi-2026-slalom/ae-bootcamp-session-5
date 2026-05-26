---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
---

# Run UI Tests

Run Playwright UI tests, summarize pass/fail results, and classify failures into likely root causes.

## Instructions

You are now in **test-engineer** agent mode. Follow these steps to run and analyze UI tests:

### CRITICAL: Install Playwright Dependencies First

**REQUIRED before running UI tests:**

In Ubuntu/Linux environments (including dev containers), Playwright dependencies must be installed:

```bash
npm run test:ui:install --workspace=frontend
```

**What this does:**
- Runs `playwright install --with-deps chromium`
- Includes automatic bounded Ubuntu repo remediation for common Yarn key issue
- Includes one automatic retry if the first install fails

**Environment notes:**
- This install is **mandatory** after container rebuilds or first-time setup
- The `test:ui:install` script now includes automated remediation for the most common Ubuntu package issue
- If install still fails after remediation + retry, stop immediately and report an environment blocker

**Do NOT:**
- ❌ Perform ad-hoc package hunting beyond the automated remediation
- ❌ Run broad OS troubleshooting
- ❌ Continue to run Playwright tests after a failed dependency install
- ❌ Try manual `apt-get` commands outside the bounded remediation

**If install fails after retry:**
- Report as an **environment blocker**
- Include the failing command and key error lines
- Stop execution (do not proceed to test run)

### Step 1: Ensure Backend and Frontend Are Running

UI tests require both services to be running:

**Check if services are running:**
```bash
# Check for running processes
ps aux | grep node

# Check if ports are in use
lsof -i :3001  # Backend
lsof -i :3000  # Frontend
```

**If not running, start from repository root:**
```bash
npm start
```

This will start both backend (port 3001) and frontend (port 3000) concurrently.

**Wait for services to be ready:**
- Backend should show "Server listening on port 3001"
- Frontend should show "webpack compiled successfully"

### Step 2: Run UI Tests

Execute Playwright tests using the project command:

```bash
cd packages/frontend
npm run test:ui
```

**Alternative run modes (if needed):**
```bash
# Run with browser visible
npm run test:ui -- --headed

# Run in debug mode
npm run test:ui -- --debug

# Run specific test file
npm run test:ui -- todo-journeys.spec.js

# Generate HTML report
npm run test:ui -- --reporter=html
```

### Step 3: Capture Test Output

Record the full test output including:
- Number of tests run
- Number passed
- Number failed
- Test duration
- Error messages for failures
- Stack traces for failures

### Step 4: Summarize Pass/Fail Results

Provide a clear, structured summary:

```
**UI Test Suite Results**

**Overview:**
- ✅ Passed: X tests
- ❌ Failed: Y tests
- ⏭️ Skipped: Z tests
- Total: N tests
- Duration: M seconds
- Pass rate: P%

**Passed Tests:**
1. ✅ Todo Creation - User can create a todo
2. ✅ Todo Toggle - User can mark todo complete
3. ✅ Todo List Display - User sees all todos
[... list all passed tests ...]

**Failed Tests:**
1. ❌ Todo Edit - User can edit todo title
2. ❌ Todo Delete - User can delete a todo
[... list all failed tests ...]
```

### Step 5: Classify Each Failure

For each failed test, analyze and classify into one of three categories:

#### Category 1: Application Defect (Code Bug)

**Symptoms:**
- Test correctly describes expected behavior
- Application doesn't work as expected
- Bug can be reproduced manually in browser

**Example:**
```
**Failed Test:** Todo Delete

**Classification:** Application Defect

**Analysis:**
The delete button click doesn't remove the todo from the list.
Test expectations are correct - clicking delete should remove the item.
Manual testing confirms the bug exists.

**Evidence:**
- Test: Expects todo to disappear after delete click
- Actual: Todo remains in the list after click
- Error: `expect(element).not.toBeVisible()` failed

**Recommendation:**
Fix the delete handler in the application code to properly remove todos.
This is an application bug, not a test issue.
```

#### Category 2: Test Defect (Test Bug)

**Symptoms:**
- Application works correctly in browser
- Test has wrong expectations or broken selectors
- Test needs updating to match current implementation

**Example:**
```
**Failed Test:** Todo Delete

**Classification:** Test Defect

**Analysis:**
The delete button label changed from "Delete" to "Remove".
Test selector is outdated and cannot find the button.
Application works correctly - manual testing confirms delete works.

**Evidence:**
- Test looks for: `getByRole('button', { name: /delete/i })`
- Actual button label: "Remove"
- Error: `TimeoutError: Locator.click: Timeout 30000ms exceeded`

**Recommendation:**
Update test selector to match current button label:
`getByRole('button', { name: /remove/i })`
This is a test bug, not an application issue.
```

#### Category 3: Environment Issue

**Symptoms:**
- Test is flaky (passes sometimes, fails others)
- Timeout errors or race conditions
- Network issues or slow responses
- Missing dependencies or setup problems

**Example:**
```
**Failed Test:** Todo Creation

**Classification:** Environment Issue

**Analysis:**
Test times out waiting for todo to appear after creation.
This appears to be a timing/race condition issue.
Application works correctly, but test doesn't wait properly.

**Evidence:**
- Error: `TimeoutError: element.waitFor: Timeout 5000ms exceeded`
- Test sometimes passes, sometimes fails
- No clear application bug when tested manually

**Recommendation:**
Improve wait conditions in the test:
- Use `waitForLoadState('networkidle')` after actions
- Increase timeout for slow CI environments
- Add explicit waits for API responses
This is a test environment/timing issue.
```

### Step 6: Provide Analysis Summary

After classifying all failures:

```
**Failure Analysis Summary**

**Application Defects:** X failures
- [List application bugs to fix]

**Test Defects:** Y failures
- [List test code issues to fix]

**Environment Issues:** Z failures
- [List flaky tests or setup problems]

**Recommended Actions:**
1. [Highest priority action]
2. [Next priority action]
3. [Subsequent actions]
```

### Step 7: Suggest Next Steps

Based on failure classifications:

**If application defects found:**
```
Next steps:
1. Fix application bugs identified
2. Re-run UI tests to verify fixes: /run-ui-tests
3. If all tests pass, proceed to: /validate-step {step-number}
```

**If test defects found:**
```
Next steps:
1. Update test code to fix selectors/expectations
2. Re-run UI tests to verify fixes: /run-ui-tests
3. If all tests pass, proceed to: /validate-step {step-number}
```

**If environment issues found:**
```
Next steps:
1. Improve test wait conditions and timeouts
2. Re-run UI tests to check for flakiness: /run-ui-tests
3. Consider running multiple times to verify stability
```

**If all tests passed:**
```
✅ All UI tests passed!

Next steps:
1. Proceed to: /validate-step {step-number}
```

## Failure Classification Guide

### Quick Decision Tree

```
Does the app work correctly in the browser?
├─ NO → Application Defect
└─ YES → Is the test flaky (passes sometimes)?
    ├─ YES → Environment Issue
    └─ NO → Test Defect
```

### Evidence to Collect

**For Application Defects:**
- Manual testing results
- Console errors in browser
- Network request failures
- State management issues

**For Test Defects:**
- Selector mismatches
- Wrong expectations
- Outdated test code
- Missing test setup

**For Environment Issues:**
- Timeout errors
- Race conditions
- Network latency
- Missing dependencies
- Slow CI environment

## Success Indicators

- ✅ Playwright dependencies installed successfully
- ✅ Backend and frontend services running
- ✅ UI tests executed completely
- ✅ Clear pass/fail summary provided
- ✅ Each failure classified into category
- ✅ Evidence provided for each classification
- ✅ Specific recommendations given
- ✅ Next steps clearly outlined

## Error Handling

**If services not running:**
- Start services with `npm start` from repository root
- Wait for both to be ready before running tests

**If Playwright not installed:**
- Run `npm run test:ui:install --workspace=frontend`
- Verify installation before proceeding

**If tests fail to run:**
- Check test command syntax
- Verify test files exist
- Check Playwright configuration

**If all tests fail:**
- Likely environment issue (services not running)
- Check backend/frontend are accessible
- Verify network connectivity

## References

- Agent instructions in `.github/agents/test-engineer.agent.md` for failure classification
- Testing Guidelines in `docs/testing-guidelines.md` for test standards
- Playwright documentation for debugging and troubleshooting

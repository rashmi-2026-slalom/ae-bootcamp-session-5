---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
---

# Create UI Tests

Create Playwright UI tests for critical user journeys using Page Object Model patterns with stable selectors and state-based waits.

## Instructions

You are now in **test-engineer** agent mode. Follow these steps to create UI tests:

### Optional Input

Journeys to test: `${input:journeys:Enter specific journeys (or leave blank for default: create, edit, toggle, delete, error-state)}`

**Default journeys if not specified:**
- Create todo
- Edit todo
- Toggle todo completion
- Delete todo
- Core error-state handling

### HARD LIMIT: Maximum 5 Playwright Tests

**CRITICAL CONSTRAINT:**
- Create a **maximum of 5 Playwright test cases** (`test(...)` or `it(...)`) in this run
- Target **3-5 total tests** for comprehensive coverage without excess
- Include **at least 1 error-path test** within the 3-5 total
- If more than 5 candidate scenarios exist, **select the highest-risk 5** and list deferred scenarios
- Before finishing, **verify the count** of created/updated Playwright test cases and reduce to ≤ 5 if over the limit
- Do not claim "small scope" if the final authored count is greater than 5

### Step 1: Review Existing Test Coverage

Check what UI tests already exist:
```bash
ls -la packages/frontend/tests/ui/
```

Review existing test files to avoid duplication.

### Step 2: Identify Coverage Gaps

Determine which journeys need tests:
- ✅ Already covered - skip or enhance if needed
- ❌ Not covered - create new tests
- ⚠️ Partially covered - complete coverage

**Apply the 5-test limit:**
- If more than 5 gaps exist, prioritize the highest-risk journeys
- Create tests for top 5 only
- List remaining scenarios as "deferred coverage"

### Step 3: Design Page Object Structure

Create or update page objects in `packages/frontend/tests/ui/pages/`:

**Page Object Principles:**
- Encapsulate UI interactions and selectors
- Use stable, accessibility-first selectors
- Provide reusable methods for common actions
- Keep page objects focused on interactions, not assertions

**Example Structure:**
```javascript
// packages/frontend/tests/ui/pages/TodoPage.js
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Stable selectors (accessibility-first)
    this.newTodoInput = page.getByRole('textbox', { name: /new todo/i });
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoList = page.getByRole('list', { name: /todo list/i });
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
    await this.page.waitForLoadState('networkidle');
  }

  async addTodo(title) {
    await this.newTodoInput.fill(title);
    await this.addButton.click();
    await this.page.getByText(title).waitFor();
  }

  async getTodoByTitle(title) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  async toggleTodo(title) {
    const todo = await this.getTodoByTitle(title);
    await todo.getByRole('checkbox').click();
  }

  async deleteTodo(title) {
    const todo = await this.getTodoByTitle(title);
    await todo.getByRole('button', { name: /delete|remove/i }).click();
  }

  async editTodo(oldTitle, newTitle) {
    const todo = await this.getTodoByTitle(oldTitle);
    await todo.getByRole('button', { name: /edit/i }).click();
    const input = todo.getByRole('textbox');
    await input.fill(newTitle);
    await todo.getByRole('button', { name: /save/i }).click();
  }
}

module.exports = { TodoPage };
```

### Step 4: Write Test Scenarios

Create test files in `packages/frontend/tests/ui/`:

**Test File Principles:**
- Focus on scenario intent and assertions
- Use page objects for interactions
- Keep tests isolated (no shared state)
- Use descriptive test names
- Include setup and teardown
- **ENFORCE: Maximum 5 test cases total**

**Example Test File:**
```javascript
// packages/frontend/tests/ui/todo-journeys.spec.js
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('user can create a todo', async ({ page }) => {
    await todoPage.addTodo('Buy groceries');
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('user can toggle todo completion', async ({ page }) => {
    await todoPage.addTodo('Buy groceries');
    await todoPage.toggleTodo('Buy groceries');
    
    const todo = await todoPage.getTodoByTitle('Buy groceries');
    await expect(todo.getByRole('checkbox')).toBeChecked();
  });

  test('user can delete a todo', async ({ page }) => {
    await todoPage.addTodo('Buy groceries');
    await todoPage.deleteTodo('Buy groceries');
    await expect(page.getByText('Buy groceries')).not.toBeVisible();
  });

  test('user sees error on empty todo creation', async ({ page }) => {
    await todoPage.addButton.click(); // Try to add without title
    await expect(page.getByText(/title.*required/i)).toBeVisible();
  });

  // LIMIT REACHED: 4 tests (within 3-5 target)
  // If 5th test needed, add one more critical scenario
});
```

### Step 5: Use Stable Selectors

**Selector Priority (highest to lowest):**
1. `getByRole()` - Accessibility-based (preferred)
2. `getByLabelText()` - Form labels
3. `getByPlaceholder()` - Input placeholders
4. `getByText()` - Unique text content
5. `data-testid` - Custom test attributes
6. Avoid: CSS selectors, XPath, element position

**Examples:**
```javascript
// ✅ PREFER: Accessibility queries
page.getByRole('button', { name: /add/i })
page.getByRole('checkbox')
page.getByRole('textbox', { name: /new todo/i })

// ⚠️ OK: Test IDs when needed
page.getByTestId('todo-item-123')

// ❌ AVOID: Brittle selectors
page.locator('.btn-primary')
page.locator('#todo-123')
```

### Step 6: Use State-Based Waits

**Wait Patterns:**
```javascript
// ✅ PREFER: State-based waits
await page.waitForLoadState('networkidle');
await element.waitFor({ state: 'visible' });
await expect(element).toBeVisible();

// ❌ AVOID: Arbitrary timeouts
await page.waitForTimeout(2000);
```

### Step 7: Verify Test Count and Report

**Before finishing:**
1. Count all `test(...)` or `it(...)` calls created/updated
2. If count > 5, reduce to highest-priority 5 scenarios
3. List any deferred scenarios

**Report:**
```
**UI Tests Created**

**Files Modified:**
- packages/frontend/tests/ui/pages/TodoPage.js (page object)
- packages/frontend/tests/ui/todo-journeys.spec.js (4 test scenarios)

**Test Scenarios Covered:**
1. ✅ Create todo journey
2. ✅ Toggle todo completion journey
3. ✅ Delete todo journey
4. ✅ Error handling - empty todo creation

**Test Count:** 4 Playwright tests (within 3-5 target ✓)

**Deferred Scenarios:** (if applicable)
- Edit todo journey (lower priority, deferred)

**Next Steps:**
1. Run: /run-ui-tests
```

## Best Practices

### Page Object Model (POM)
- ✅ Put selectors and interactions in page objects
- ✅ Keep tests focused on scenarios and assertions
- ✅ Reuse page object methods across tests
- ❌ Don't duplicate selectors in test files

### Test Isolation
- ✅ Each test sets up its own data
- ✅ Tests can run in any order
- ✅ No shared state between tests
- ❌ Don't depend on previous test outcomes

### Deterministic Tests
- ✅ Use state-based waits
- ✅ Wait for elements to be ready
- ✅ Handle async operations properly
- ❌ Don't use arbitrary timeouts

### Readability
- ✅ Descriptive test names
- ✅ Clear arrange-act-assert structure
- ✅ Meaningful variable names
- ❌ Don't write cryptic test code

## Success Indicators

- ✅ Page objects created or updated
- ✅ Test scenarios written (3-5 tests maximum)
- ✅ Stable, accessibility-first selectors used
- ✅ State-based waits implemented
- ✅ Tests are isolated and deterministic
- ✅ Test count verified (≤ 5 Playwright tests)
- ✅ Coverage gaps identified and addressed
- ✅ Files and scenarios reported clearly

## Error Handling

**If test count exceeds 5:**
- Reduce to highest-priority 5 scenarios
- List deferred scenarios separately

**If page objects don't exist:**
- Create the page object structure first
- Then write tests using the page objects

**If journeys are unclear:**
- Ask user to clarify which journeys to test
- Suggest default set if user unsure

## References

- Agent instructions in `.github/agents/test-engineer.agent.md` for POM patterns
- Testing Guidelines in `docs/testing-guidelines.md` for test standards
- Playwright documentation for selector and wait strategies

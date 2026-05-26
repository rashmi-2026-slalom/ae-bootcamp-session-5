# Code Patterns Discovered

## Purpose
Document recurring code patterns, architectural decisions, and solutions discovered during development. Use this as a reference for maintaining consistency across the codebase.

## Pattern Template

```markdown
## Pattern: [Pattern Name]

**Context:** When/where this pattern applies

**Problem:** What issue does this pattern solve?

**Solution:** The pattern to follow

**Example:**
```[language]
// Code example demonstrating the pattern
```

**Related Files:**
- List of files where this pattern is used

**When to Apply:**
- Situations where this pattern should be used

**When to Avoid:**
- Situations where this pattern should NOT be used
```

---

## Pattern: Service Initialization with Empty Arrays

**Context:** When initializing data storage for collections (todos, items, etc.) in service modules

**Problem:** Inconsistent initialization between `null` and empty arrays causes:
- Type errors when calling array methods (.map, .filter, .find)
- Conditional checks scattered throughout code
- Test failures due to unexpected null values
- API responses returning null instead of empty arrays

**Solution:** Always initialize collection storage as empty arrays `[]`, never `null`

**Example:**
```javascript
// ✅ CORRECT: Initialize with empty array
let todos = [];

app.get('/api/todos', (req, res) => {
  res.json(todos); // Always returns array, even if empty
});

// ❌ INCORRECT: Initialize with null
let todos = null;

app.get('/api/todos', (req, res) => {
  res.json(todos || []); // Requires null check everywhere
});
```

**Related Files:**
- `packages/backend/src/app.js` - TODO storage initialization
- `packages/backend/__tests__/app.test.js` - Test expectations

**When to Apply:**
- Any in-memory collection storage
- Service layer data initialization
- API response preparation for list endpoints

**When to Avoid:**
- Single item storage (where null might indicate "not found")
- Optional values that genuinely represent "no value set"
- Database query results that need to distinguish between "no results" and "not queried yet"

**Additional Notes:**
- This pattern ensures consistent behavior across all API endpoints
- Eliminates the need for null checks before array operations
- Makes tests simpler and more predictable
- Follows JavaScript best practice for collection initialization

---

## Pattern: [Add New Patterns Here]

Use the template above to document new patterns as they're discovered during development.

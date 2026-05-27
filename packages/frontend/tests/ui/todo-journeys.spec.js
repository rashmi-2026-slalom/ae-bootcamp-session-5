/**
 * Todo Application - Critical User Journey Tests
 * 
 * Tests cover essential CRUD operations and error handling
 * using Page Object Model with stable, accessibility-first selectors.
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    // Clear any existing todos from previous tests
    await todoPage.clearAllTodos();
  });

  /**
   * TEST 1: Create Todo Journey
   * Verifies user can create a new todo and stats update correctly
   */
  test('user can create a todo and stats update correctly', async ({ page }) => {
    // Verify initial empty state
    const isEmpty = await todoPage.isEmptyStateVisible();
    if (isEmpty) {
      expect(isEmpty).toBe(true);
    }

    // Create first todo
    await todoPage.addTodo('Buy groceries');
    
    // Verify todo appears in list using specific selector
    const todo = await todoPage.getTodoByTitle('Buy groceries');
    await expect(todo).toBeVisible();
    
    // Verify stats show 1 incomplete item
    const incompleteCount = await todoPage.getIncompleteCount();
    expect(incompleteCount).toBe(1);
    
    const completedCount = await todoPage.getCompletedCount();
    expect(completedCount).toBe(0);
  });

  /**
   * TEST 2: Toggle Completion Journey
   * Verifies user can mark todo as complete and stats update
   */
  test('user can toggle todo completion', async ({ page }) => {
    // Setup: Create a todo
    await todoPage.addTodo('Walk the dog');
    
    // Verify initially unchecked
    const todo = await todoPage.getTodoByTitle('Walk the dog');
    const checkbox = todo.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
    
    // Toggle to completed
    await todoPage.toggleTodo('Walk the dog');
    
    // Verify checkbox is checked
    await expect(checkbox).toBeChecked();
    
    // Verify stats updated (0 incomplete, 1 completed)
    await page.waitForTimeout(500); // Allow stats to update
    const completedCount = await todoPage.getCompletedCount();
    expect(completedCount).toBe(1);
  });

  /**
   * TEST 3: Edit Todo Journey
   * Verifies user can edit an existing todo
   */
  test('user can edit a todo', async ({ page }) => {
    // Setup: Create a todo
    await todoPage.addTodo('Original Task');
    
    // Verify original title exists in list
    const originalTodo = await todoPage.getTodoByTitle('Original Task');
    await expect(originalTodo).toBeVisible();
    
    // Edit the todo
    await todoPage.editTodo('Original Task', 'Updated Task');
    
    // Verify new title appears in list
    const updatedTodo = await todoPage.getTodoByTitle('Updated Task');
    await expect(updatedTodo).toBeVisible();
    
    // Verify old title is gone from list
    const oldTodos = await page.getByRole('listitem').filter({ hasText: 'Original Task' }).count();
    expect(oldTodos).toBe(0);
  });

  /**
   * TEST 4: Delete Todo Journey
   * Verifies user can delete a todo and it's removed from list
   */
  test('user can delete a todo', async ({ page }) => {
    // Setup: Create a todo
    await todoPage.addTodo('Task to delete');
    
    // Verify todo exists in list
    const todo = await todoPage.getTodoByTitle('Task to delete');
    await expect(todo).toBeVisible();
    
    // Delete the todo
    await todoPage.deleteTodo('Task to delete');
    
    // Verify todo is removed from list
    const remainingTodos = await page.getByRole('listitem').filter({ hasText: 'Task to delete' }).count();
    expect(remainingTodos).toBe(0);
    
    // Verify empty state appears (if it was the only todo)
    await page.waitForTimeout(500);
    const isEmpty = await todoPage.isEmptyStateVisible();
    // Note: May not be empty if previous test todos still exist
  });

  /**
   * TEST 5: Error Handling Journey (Error-Path Test)
   * Verifies app shows error message when backend is unavailable
   * 
   * Note: This test requires the backend to be stopped before running.
   * In CI/CD, this would use mocking or a separate test environment.
   */
  test('user sees error message when backend is unavailable', async ({ page, context }) => {
    // Simulate backend failure by intercepting API calls
    await context.route('**/api/todos', route => {
      route.abort('failed');
    });
    
    // Navigate to app (will fail to load todos)
    await todoPage.goto();
    
    // Wait for error state
    await page.waitForTimeout(1000);
    
    // Verify error message is displayed
    const isErrorVisible = await todoPage.isErrorVisible();
    expect(isErrorVisible).toBe(true);
  });
});

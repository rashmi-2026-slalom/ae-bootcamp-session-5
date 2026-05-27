/**
 * TodoPage - Page Object Model for Todo Application
 * 
 * Encapsulates UI interactions and selectors using accessibility-first approach.
 * Provides reusable methods for common todo operations.
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Stable selectors (accessibility-first)
    this.newTodoInput = () => page.getByPlaceholder(/what needs to be done/i);
    this.addButton = () => page.getByRole('button', { name: /add/i });
  }

  /**
   * Navigate to the todo application
   */
  async goto() {
    await this.page.goto('http://localhost:3000');
    // Wait for app to be fully loaded
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all todos (for test cleanup)
   */
  async clearAllTodos() {
    await this.page.waitForLoadState('networkidle');
    
    // Keep deleting until no todos left
    let deleteButtons = await this.page.getByRole('button', { name: /delete/i }).all();
    while (deleteButtons.length > 0) {
      await deleteButtons[0].click();
      await this.page.waitForTimeout(300);
      deleteButtons = await this.page.getByRole('button', { name: /delete/i }).all();
    }
    
    // Wait for empty state
    await this.page.waitForTimeout(500);
  }

  /**
   * Add a new todo item
   * @param {string} title - The todo title
   */
  async addTodo(title) {
    await this.newTodoInput().fill(title);
    await this.addButton().click();
    // Wait for todo to appear in the list using specific selector
    // Use .first() to handle potential duplicates during transition
    await this.page.getByRole('listitem').filter({ hasText: title }).first().waitFor({ timeout: 5000 });
  }

  /**
   * Get a todo item by its title
   * @param {string} title - The todo title
   * @returns {Locator} The todo list item
   */
  async getTodoByTitle(title) {
    return this.page.getByRole('listitem').filter({ hasText: title }).first();
  }

  /**
   * Toggle todo completion status
   * @param {string} title - The todo title
   */
  async toggleTodo(title) {
    const todo = await this.getTodoByTitle(title);
    await todo.getByRole('checkbox').click();
    // Wait for state change
    await this.page.waitForTimeout(500);
  }

  /**
   * Delete a todo item
   * @param {string} title - The todo title
   */
  async deleteTodo(title) {
    const todo = await this.getTodoByTitle(title);
    await todo.getByRole('button', { name: /delete/i }).click();
    // Wait for todo to be removed
    await this.page.waitForTimeout(500);
  }

  /**
   * Edit a todo item
   * @param {string} oldTitle - Current todo title
   * @param {string} newTitle - New todo title
   */
  async editTodo(oldTitle, newTitle) {
    // Click the edit button for the specific todo
    const todo = await this.getTodoByTitle(oldTitle);
    await todo.getByRole('button', { name: /edit/i }).click();
    
    // Wait for edit mode to activate
    await this.page.waitForTimeout(1000);
    
    // The TextField appears in the list item - find it by looking for a textbox
    // that's not the "Add todo" input at the top
    const allTextboxes = await this.page.getByRole('textbox').all();
    
    // Filter out the add todo input
    let editInput = null;
    for (const box of allTextboxes) {
      const value = await box.inputValue();
      const placeholder = await box.getAttribute('placeholder');
      
      // The edit textbox should have the current todo title as its value
      if (placeholder !== 'Add a new todo...' && value === oldTitle) {
        editInput = box;
        break;
      }
    }
    
    if (!editInput) {
      throw new Error(`Could not find edit textbox for todo: ${oldTitle}`);
    }
    
    // Clear and fill with new title
    await editInput.fill(newTitle);
    
    // Click save button
    await this.page.getByRole('button', { name: /save/i }).click();
    
    // Wait for save to complete and UI to update
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get the incomplete todo count
   * @returns {Promise<number>}
   */
  async getIncompleteCount() {
    const chip = this.page.getByText(/items left/i);
    const text = await chip.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get the completed todo count
   * @returns {Promise<number>}
   */
  async getCompletedCount() {
    const chip = this.page.getByText(/completed/i);
    const text = await chip.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Check if empty state message is visible
   * @returns {Promise<boolean>}
   */
  async isEmptyStateVisible() {
    try {
      await this.page.getByText(/no todos yet/i).waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>}
   */
  async isErrorVisible() {
    try {
      await this.page.getByText(/error loading todos/i).waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { TodoPage };

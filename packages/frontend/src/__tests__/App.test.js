import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock todos data
const mockTodos = [
  { id: 1, title: 'Test Todo 1', completed: false },
  { id: 2, title: 'Test Todo 2', completed: true },
  { id: 3, title: 'Test Todo 3', completed: false },
];

// Setup mock fetch before each test
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

// Helper to render App with QueryClient
const renderApp = () => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
};

test('renders TODO App heading', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  renderApp();

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

// TEST 1: Delete functionality
test('deletes a todo when delete button is clicked', async () => {
  const user = userEvent.setup();

  // Mock initial fetch
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos,
  });

  renderApp();

  // Wait for todos to load
  await waitFor(() => {
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
  });

  // Mock delete request
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({}),
  });

  // Mock refetch after delete
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos.filter(t => t.id !== 1),
  });

  // Find and click delete button for first todo
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  await user.click(deleteButtons[0]);

  // Verify delete API was called
  await waitFor(() => {
    const deleteCalls = global.fetch.mock.calls.filter(
      call => call[0].includes('/1') && call[1]?.method === 'DELETE'
    );
    expect(deleteCalls.length).toBeGreaterThan(0);
  });
});

// TEST 2: Stats calculation
test('displays correct stats for incomplete and completed todos', async () => {
  // Mock fetch with todos
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos, // 2 incomplete, 1 completed
  });

  renderApp();

  // Wait for stats to appear with correct counts
  await waitFor(() => {
    expect(screen.getByText('2 items left')).toBeInTheDocument();
  });
  expect(screen.getByText('1 completed')).toBeInTheDocument();
});

// TEST 3: Empty state message
test('shows empty state message when no todos exist', async () => {
  // Mock fetch with empty array
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  renderApp();

  // Wait for empty state message
  await waitFor(() => {
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});

// TEST 4: Error handling
test('displays error message when fetch fails', async () => {
  // Mock fetch failure
  global.fetch.mockRejectedValueOnce(new Error('Network error'));

  renderApp();

  // Wait for error message
  await waitFor(() => {
    expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
  });
});

// TEST 5: Edit functionality
test('edits a todo when edit button is clicked', async () => {
  const user = userEvent.setup();

  // Mock initial fetch
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodos,
  });

  renderApp();

  // Wait for todos to load
  await waitFor(() => {
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
  });

  // Find and click edit button for first todo
  const editButtons = screen.getAllByRole('button', { name: /edit/i });
  await user.click(editButtons[0]);

  // Should show edit input field
  const editInput = await screen.findByDisplayValue('Test Todo 1');
  expect(editInput).toBeInTheDocument();

  // Change the text
  await user.clear(editInput);
  await user.type(editInput, 'Updated Todo 1');

  // Mock update request
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ...mockTodos[0], title: 'Updated Todo 1' }),
  });

  // Mock refetch after update
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { ...mockTodos[0], title: 'Updated Todo 1' },
      mockTodos[1],
      mockTodos[2],
    ],
  });

  // Save the edit
  const saveButton = screen.getByRole('button', { name: /save/i });
  await user.click(saveButton);

  // Verify update API was called
  await waitFor(() => {
    const updateCalls = global.fetch.mock.calls.filter(
      call => call[0].includes('/1') && call[1]?.method === 'PUT'
    );
    expect(updateCalls.length).toBeGreaterThan(0);
  });
});

// TEST 6: API URL uses relative path
test('uses relative API URL instead of hardcoded localhost', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  renderApp();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  // Check that fetch was called with relative URL
  const fetchCall = global.fetch.mock.calls[0][0];
  expect(fetchCall).toMatch(/^\/api\/todos/);
  expect(fetchCall).not.toContain('localhost');
});


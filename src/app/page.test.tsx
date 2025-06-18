// /**
//  * @jest-environment jsdom
//  */
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import TodoApp from './page';

// beforeEach(() => {
//   // Mock localStorage
//   Storage.prototype.getItem = jest.fn(() => '[]');
//   Storage.prototype.setItem = jest.fn();
// });

// describe('TodoApp', () => {
//   test('renders input and add button', () => {
//     render(<TodoApp />);
//     expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
//     expect(screen.getByText('➕')).toBeInTheDocument(); // ✅ use text
//   });

//   test('adds a new todo item', () => {
//     render(<TodoApp />);
//     const input = screen.getByPlaceholderText(/what needs to be done/i);
//     fireEvent.change(input, { target: { value: 'Test todo' } });

//     const addButton = screen.getByText('➕');
//     fireEvent.click(addButton);

//     expect(screen.getByText('Test todo')).toBeInTheDocument();
//   });
// });






import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoApp from './page';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
});

describe('TodoApp', () => {
//   test('renders title and input', () => {
//     render(<TodoApp />);
//     expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/What needs to be done/i)).toBeInTheDocument();
//   });

   test('renders title and input', () => {
  render(<TodoApp />);
  expect(screen.getByRole('heading', { name: /Tasks/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/What needs to be done/i)).toBeInTheDocument();
});


  test('adds a new todo item', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const addButton = screen.getByRole('button', { name: /➕/ });

    await userEvent.type(input, 'Buy milk');
    fireEvent.click(addButton);

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  test('toggles todo completion', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const addButton = screen.getByRole('button', { name: /➕/ });

    await userEvent.type(input, 'Task One');
    fireEvent.click(addButton);

    const toggleButton = screen.getByRole('button', { name: '' }); // ✔️ button has empty name
    fireEvent.click(toggleButton);

    expect(screen.getByText('Task One')).toHaveClass('line-through');
  });

  test('deletes a todo item', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const addButton = screen.getByRole('button', { name: /➕/ });

    await userEvent.type(input, 'Remove Me');
    fireEvent.click(addButton);

    const deleteBtn = await screen.findByTitle('Delete');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('Remove Me')).not.toBeInTheDocument();
  });

  test('edits a todo item', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const addButton = screen.getByRole('button', { name: /➕/ });

    await userEvent.type(input, 'Edit me');
    fireEvent.click(addButton);

    const editBtn = await screen.findByTitle('Edit');
    fireEvent.click(editBtn);

    const editInput = screen.getByDisplayValue('Edit me');
    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'Edited task');
    fireEvent.keyPress(editInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(screen.getByText('Edited task')).toBeInTheDocument();
  });

//   test('filters active and completed tasks', async () => {
//     render(<TodoApp />);
//     const input = screen.getByPlaceholderText(/What needs to be done/i);
//     const addButton = screen.getByRole('button', { name: /➕/ });

//     await userEvent.type(input, 'Task1');
//     fireEvent.click(addButton);

//     await userEvent.type(input, 'Task2');
//     fireEvent.click(addButton);

//     const checkBtns = screen.getAllByRole('button', { name: '' });
//     fireEvent.click(checkBtns[0]); // Mark one as completed

//     const completedFilter = screen.getByRole('button', { name: 'completed' });
//     fireEvent.click(completedFilter);

//     expect(screen.getByText('Task1')).toBeInTheDocument();
//     // expect(screen.queryByText('Completed')).not.toBeInTheDocument();
//     const todoTexts = screen.getAllByRole('listitem').map(li => li.textContent);
//      expect(todoTexts).not.toContain('Task2');

//     const activeFilter = screen.getByRole('button', { name: 'active' });
//     fireEvent.click(activeFilter);

//     expect(screen.getByText('Task2')).toBeInTheDocument();
//     expect(screen.queryByText('Task1')).not.toBeInTheDocument();
//   });

test('filters active and completed tasks', async () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/What needs to be done/i);
  const addButton = screen.getByRole('button', { name: /➕/ });

  // Add Task1
  await userEvent.type(input, 'Task1');
  fireEvent.click(addButton);

  // Add Task2
  await userEvent.type(input, 'Task2');
  fireEvent.click(addButton);

  // Mark Task1 as completed
  const task1Toggle = screen.getAllByRole('button', { name: '' })[0]; // Assumes Task1 is first
  fireEvent.click(task1Toggle);

  // Filter: Completed
  const completedFilter = screen.getByRole('button', { name: /completed/i });
  fireEvent.click(completedFilter);

  // Task1 should be visible, Task2 should not
  expect(screen.getByText((content, element) => element?.textContent === 'Task1')).toBeInTheDocument();
  expect(screen.queryByText((content, element) => element?.textContent === 'Task2')).not.toBeInTheDocument();

  // Filter: Active
  const activeFilter = screen.getByRole('button', { name: /active/i });
  fireEvent.click(activeFilter);

  // Task2 should be visible, Task1 should not
  expect(screen.getByText((content, element) => element?.textContent === 'Task2')).toBeInTheDocument();
  expect(screen.queryByText((content, element) => element?.textContent === 'Task1')).not.toBeInTheDocument();
});

});

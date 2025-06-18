'use client'
import React, { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(savedTodos.map((todo: Todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt)
    })));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([newTodo, ...todos]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-blue-200 text-lg">Stay organized, stay productive</p>
        </div>

        {/* Add Todo Input */}
        <div className="mb-8">
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 pr-14"
            />
            <button
              onClick={addTodo}
              className="absolute right-2 top-2 p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white hover:from-pink-600 hover:to-purple-600 transform hover:scale-105"
            >
              ➕
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${
                  filter === filterType
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white">{activeCount}</div>
            <div className="text-white/70 text-sm">Active Tasks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white">{completedCount}</div>
            <div className="text-white/70 text-sm">Completed</div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-white/60 text-lg">
                {filter === 'all' ? 'No tasks yet. Add one above!' :
                 filter === 'active' ? 'No active tasks!' :
                 'No completed tasks yet!'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 hover:border-white/30 hover:shadow-lg ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${
                      todo.completed
                        ? 'bg-green-400 border-green-400 text-white'
                        : 'border-white/40 hover:border-white/60 text-white'
                    }`}
                  >
                    {todo.completed ? '✔' : ''}
                  </button>

                  {/* Todo Text or Edit Input */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="w-full bg-transparent text-white text-lg focus:outline-none border-b border-white/40 pb-1"
                        autoFocus
                      />
                    ) : (
                      <div
                        className={`text-lg text-white ${
                          todo.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {todo.text}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="text-green-400 hover:bg-green-400/20 rounded-lg px-2"
                          title="Save"
                        >
                          💾
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-400 hover:bg-red-400/20 rounded-lg px-2"
                          title="Cancel"
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="text-blue-400 hover:bg-blue-400/20 rounded-lg px-2"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-400 hover:bg-red-400/20 rounded-lg px-2"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-white/40 text-sm">
            Built with Next.js & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

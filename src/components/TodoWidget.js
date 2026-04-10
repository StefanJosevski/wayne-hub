import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'wayne-hub-todos';

function TodoWidget({ searchQuery }) {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Audit Q3 Wayne Enterprises financials', done: false },
        { id: 2, text: 'Review Lucius Fox prototype report', done: false },
        { id: 3, text: 'Gotham charity gala — confirm attendance', done: true },
      ];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false },
    ]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  // Apply filter + search
  const visible = todos.filter((t) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !t.done) ||
      (filter === 'done' && t.done);

    const matchesSearch =
      !searchQuery.trim() ||
      t.text.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">◇ DIRECTIVES</span>
        <span className="panel-badge">{doneCount}/{todos.length} COMPLETED</span>
      </div>
      <div className="panel-body">
        <div className="todo-add">
          <input
            className="todo-input"
            type="text"
            placeholder="NEW DIRECTIVE..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="add-btn" onClick={addTodo}>+</button>
        </div>

        <div className="todo-filters">
          {['all', 'active', 'done'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
          {doneCount > 0 && (
            <button className="filter-btn" onClick={clearCompleted} style={{ marginLeft: 'auto' }}>
              CLEAR DONE
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            {searchQuery
              ? `NO DIRECTIVES MATCH "${searchQuery.toUpperCase()}"`
              : filter === 'done'
              ? 'NO COMPLETED DIRECTIVES'
              : 'ALL SECTORS CLEAR'}
          </div>
        ) : (
          <div className="todo-list">
            {visible.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
                <button
                  className={`todo-check ${todo.done ? 'checked' : ''}`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.done ? '✓' : ''}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="todo-stats">
          {todos.filter((t) => !t.done).length} ACTIVE · {doneCount} RESOLVED
        </div>
      </div>
    </div>
  );
}

export default TodoWidget;

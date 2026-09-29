import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes-app-data');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes-app-data', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editId) {
      setNotes(
        notes.map((note) =>
          note.id === editId
            ? { ...note, title, content, date: new Date().toLocaleDateString() }
            : note
        )
      );
      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString(),
      };
      setNotes([newNote, ...notes]);
    }

    setTitle('');
    setContent('');
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="notes-wrapper">
        
        <div className="header">
          <h2>📝 Notes App</h2>
          <button
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Search notes by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <form onSubmit={handleSubmit} className="note-form">
          <h3 className="form-title">
            {editId ? '✏️ Edit Note' : '➕ Add New Note'}
          </h3>
          <input
            type="text"
            className="form-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="form-textarea"
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
          />
          <button type="submit" className="save-btn">
            {editId ? 'Update Note' : 'Save Note'}
          </button>
          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);
                setTitle('');
                setContent('');
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <p className="empty-msg">No notes found.</p>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="note-card">
                <div>
                  <h4 className="note-card-title">{note.title}</h4>
                  <p className="note-card-content">{note.content}</p>
                </div>
                <div className="note-card-footer">
                  <small className="note-date">{note.date}</small>
                  <div>
                    <button className="edit-btn" onClick={() => handleEdit(note)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(note.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
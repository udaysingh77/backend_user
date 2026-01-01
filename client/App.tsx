import React, { useEffect, useState } from 'react';
import { api, User, Sighting } from './api';

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [activeTab, setActiveTab] = useState<'sightings' | 'users'>('sightings');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingSighting, setEditingSighting] = useState<Sighting | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Forms
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [newSighting, setNewSighting] = useState({ description: '', location: '', dateTime: '', userId: '' });

  const fetchData = async () => {
    try {
      const [fetchedUsers, fetchedSightings] = await Promise.all([
        api.getUsers(),
        api.getSightings()
      ]);
      setUsers(fetchedUsers);
      setSightings(fetchedSightings);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser(newUser);
      setNewUser({ name: '', email: '' });
      fetchData();
    } catch (err) {
      alert("Error creating user: " + err);
    }
  };

  const handleCreateSighting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newSighting.userId) return alert("Please select a user");
      await api.createSighting({
        ...newSighting,
        userId: parseInt(newSighting.userId)
      });
      setNewSighting({ description: '', location: '', dateTime: '', userId: '' });
      fetchData();
    } catch (err) {
      alert("Error creating sighting: " + err);
    }
  };

  const handleDeleteSighting = async (id: number) => {
    if(!confirm("Are you sure?")) return;
    try {
      await api.deleteSighting(id);
      fetchData();
    } catch (err) {
      alert("Error deleting sighting");
    }
  };

  const handleUpdateSighting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSighting) return;
    try {
      await api.updateSighting(editingSighting.id, {
        description: editingSighting.description,
        location: editingSighting.location,
        dateTime: editingSighting.dateTime,
        userId: editingSighting.userId,
      });
      setEditingSighting(null);
      fetchData();
    } catch (err) {
      alert("Error updating sighting: " + err);
    }
  };

  const handleViewUser = async (userId: number) => {
    try {
      const user = await api.getUser(userId);
      setSelectedUser(user);
    } catch (err) {
      alert("Error fetching user: " + err);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await api.updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
      });
      setEditingUser(null);
      setSelectedUser(null);
      fetchData();
    } catch (err) {
      alert("Error updating user: " + err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This will also delete all their sightings.")) return;
    try {
      await api.deleteUser(userId);
      setSelectedUser(null);
      setEditingUser(null);
      fetchData();
    } catch (err) {
      alert("Error deleting user: " + err);
    }
  };

  return (
    <div style={{...styles.container, background: darkMode ? styles.darkBg : '#f0f2f5', color: darkMode ? '#e2e8f0' : '#1e293b', minHeight: '100vh', transition: 'all 0.3s ease'}}>
      <header style={{...styles.header, background: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={styles.title}>🔭 Observation System</h1>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            style={{...styles.themeToggle, background: darkMode ? '#3b82f6' : '#fbbf24', color: darkMode ? '#fff' : '#000'}}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div style={styles.tabs}>
          <button 
            style={{...styles.tab, ...(activeTab === 'sightings' ? {...styles.activeTab, background: darkMode ? '#2563eb' : '#fff', color: darkMode ? '#fff' : '#2563eb'} : {color: darkMode ? '#94a3b8' : '#64748b'})}} 
            onClick={() => setActiveTab('sightings')}
          >
            Sightings
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === 'users' ? {...styles.activeTab, background: darkMode ? '#2563eb' : '#fff', color: darkMode ? '#fff' : '#2563eb'} : {color: darkMode ? '#94a3b8' : '#64748b'})}} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {editingUser && (
          <div style={styles.modal}>
            <div style={{...styles.modalContent, background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b'}}>
              <div style={{...styles.modalHeader, borderColor: darkMode ? '#334155' : '#e2e8f0'}}>
                <h2>Edit User</h2>
                <button onClick={() => setEditingUser(null)} style={styles.closeBtn}>✕</button>
              </div>
              <form onSubmit={handleUpdateUser} style={styles.form}>
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  placeholder="Full Name" 
                  value={editingUser.name}
                  onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                  required
                />
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  type="email"
                  placeholder="Email" 
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  required
                />
                <div style={{display: 'flex', gap: '10px'}}>
                  <button type="submit" style={styles.button}>Save Changes</button>
                  <button type="button" onClick={() => setEditingUser(null)} style={{...styles.button, background: '#6b7280'}}>Cancel</button>
                  <button type="button" onClick={() => handleDeleteUser(editingUser.id)} style={{...styles.button, background: '#ef4444'}}>Delete User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedUser && !editingUser && (
          <div style={styles.modal}>
            <div style={{...styles.modalContent, background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b'}}>
              <div style={{...styles.modalHeader, borderColor: darkMode ? '#334155' : '#e2e8f0'}}>
                <h2>{selectedUser.name}</h2>
                <button onClick={() => setSelectedUser(null)} style={styles.closeBtn}>✕</button>
              </div>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Sightings:</strong> {selectedUser.sightings?.length || 0}</p>
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => setEditingUser(selectedUser)} style={styles.button}>Edit</button>
                <button onClick={() => setSelectedUser(null)} style={{...styles.button, background: '#6b7280'}}>Close</button>
              </div>
            </div>
          </div>
        )}

        {editingSighting && (
          <div style={styles.modal}>
            <div style={{...styles.modalContent, background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b'}}>
              <div style={{...styles.modalHeader, borderColor: darkMode ? '#334155' : '#e2e8f0'}}>
                <h2>Edit Sighting</h2>
                <button onClick={() => setEditingSighting(null)} style={styles.closeBtn}>✕</button>
              </div>
              <form onSubmit={handleUpdateSighting} style={styles.form}>
                <textarea 
                  style={{...styles.input, height: '80px', background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  placeholder="Description" 
                  value={editingSighting.description}
                  onChange={e => setEditingSighting({...editingSighting, description: e.target.value})}
                  required
                />
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  placeholder="Location" 
                  value={editingSighting.location}
                  onChange={e => setEditingSighting({...editingSighting, location: e.target.value})}
                  required
                />
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  type="datetime-local" 
                  value={editingSighting.dateTime}
                  onChange={e => setEditingSighting({...editingSighting, dateTime: e.target.value})}
                  required
                />
                <div style={{display: 'flex', gap: '10px'}}>
                  <button type="submit" style={styles.button}>Save Changes</button>
                  <button type="button" onClick={() => setEditingSighting(null)} style={{...styles.button, background: '#6b7280'}}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={styles.section}>
            <div style={{...styles.card, background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b'}}>
              <h2 style={styles.cardTitle}>Add New User</h2>
              <form onSubmit={handleCreateUser} style={styles.form}>
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  placeholder="Full Name" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  required
                />
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  type="email" 
                  placeholder="Email Address" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  required
                />
                <button type="submit" style={styles.button}>Create User</button>
              </form>
            </div>

            <div style={styles.list}>
              <h3 style={{...styles.subtitle, color: darkMode ? '#94a3b8' : '#64748b'}}>Registered Users ({users.length})</h3>
              <div style={styles.grid}>
                {users.map(user => (
                  <div key={user.id} style={{...styles.itemCard, background: darkMode ? '#1e293b' : '#fff', cursor: 'pointer', color: darkMode ? '#e2e8f0' : '#1e293b'}} onClick={() => handleViewUser(user.id)}>
                    <div style={{...styles.avatar, background: darkMode ? '#334155' : '#e0e7ff'}}>{user.name.charAt(0)}</div>
                    <div>
                      <div style={styles.itemName}>{user.name}</div>
                      <div style={{...styles.itemMeta, color: darkMode ? '#94a3b8' : '#64748b'}}>{user.email}</div>
                      <div style={{fontSize: '11px', color: darkMode ? '#64748b' : '#94a3b8', marginTop: '4px'}}>Click to view</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sightings' && (
          <div style={styles.section}>
            <div style={{...styles.card, background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b'}}>
              <h2 style={styles.cardTitle}>Record Sighting</h2>
              <form onSubmit={handleCreateSighting} style={styles.form}>
                <select 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  value={newSighting.userId} 
                  onChange={e => setNewSighting({...newSighting, userId: e.target.value})}
                  required
                >
                  <option value="">Select Observer</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  placeholder="What did you see?" 
                  value={newSighting.description}
                  onChange={e => setNewSighting({...newSighting, description: e.target.value})}
                  required
                />
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  placeholder="Location" 
                  value={newSighting.location}
                  onChange={e => setNewSighting({...newSighting, location: e.target.value})}
                  required
                />
                <input 
                  style={{...styles.input, background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#e2e8f0' : '#1e293b', borderColor: darkMode ? '#334155' : '#e2e8f0'}}
                  type="datetime-local" 
                  value={newSighting.dateTime}
                  onChange={e => setNewSighting({...newSighting, dateTime: e.target.value})}
                  required
                />
                <button type="submit" style={styles.button}>Record Sighting</button>
              </form>
            </div>

            <div style={styles.list}>
              <h3 style={{...styles.subtitle, color: darkMode ? '#94a3b8' : '#64748b'}}>Recent Sightings ({sightings.length})</h3>
              {sightings.length === 0 ? <p style={{...styles.empty, color: darkMode ? '#64748b' : '#94a3b8'}}>No sightings recorded yet.</p> : null}
              <div style={styles.timeline}>
                {sightings.map(sighting => (
                  <div key={sighting.id} style={{...styles.timelineItem, background: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#3b82f6' : '#3b82f6', color: darkMode ? '#e2e8f0' : '#0f172a'}}>
                    <div style={styles.timelineContent}>
                      <div style={{...styles.timelineHeader, color: darkMode ? '#e2e8f0' : '#000'}}>
                        <span style={{...styles.timelineUser, color: darkMode ? '#e2e8f0' : '#334155'}}>
                          👤 {sighting.user?.name || 'Unknown'}
                        </span>
                        <span style={{...styles.timelineDate, color: darkMode ? '#94a3b8' : '#94a3b8'}}>
                          {new Date(sighting.dateTime).toLocaleString()}
                        </span>
                      </div>
                      <h4 style={{...styles.timelineTitle, color: darkMode ? '#e2e8f0' : '#0f172a'}}>{sighting.description}</h4>
                      <p style={{...styles.timelineLocation, color: darkMode ? '#94a3b8' : '#64748b'}}>📍 {sighting.location}</p>
                      <div style={{display: 'flex', gap: '10px', marginTop: '12px'}}>
                        <button 
                          onClick={() => setEditingSighting(sighting)} 
                          style={{...styles.deleteBtn, color: '#3b82f6', textDecoration: 'underline'}}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteSighting(sighting.id)} 
                          style={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple inline styles for rapid development without external CSS files
const styles: Record<string, React.CSSProperties> = {
  darkBg: '#0f172a',
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  header: { marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', transition: 'all 0.3s ease' },
  title: { margin: '0 0 20px 0', fontSize: '28px' },
  tabs: { display: 'flex', gap: '10px' },
  tab: {
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '6px',
    color: '#64748b',
    fontWeight: 600,
    transition: 'all 0.2s ease'
  },
  activeTab: { background: '#fff', color: '#2563eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  themeToggle: {
    border: '2px solid transparent',
    cursor: 'pointer',
    fontSize: '20px',
    width: '45px',
    height: '45px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  main: { display: 'flex', flexDirection: 'column', gap: '20px' },
  section: { animation: 'fadeIn 0.3s ease-in' },
  card: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px', transition: 'all 0.3s ease' },
  cardTitle: { marginTop: 0, fontSize: '18px', color: '#334155' },
  form: { display: 'grid', gap: '12px' },
  input: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  },
  button: {
    padding: '12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s ease'
  },
  subtitle: { color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  itemCard: {
    background: '#fff',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease'
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: '#e0e7ff',
    color: '#4338ca',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  itemName: { fontWeight: 600, color: '#1e293b' },
  itemMeta: { fontSize: '12px', color: '#64748b' },
  timeline: { display: 'flex', flexDirection: 'column', gap: '16px' },
  timelineItem: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid #3b82f6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease'
  },
  timelineContent: {},
  timelineHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' },
  timelineUser: { fontWeight: 600, color: '#334155' },
  timelineDate: { color: '#94a3b8' },
  timelineTitle: { margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' },
  timelineLocation: { margin: 0, color: '#64748b', fontSize: '14px' },
  deleteBtn: {
    marginTop: '12px',
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline'
  },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '40px' },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#64748b',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default App;

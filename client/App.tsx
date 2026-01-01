import React, { useEffect, useState } from 'react';
import { api, User, Sighting } from './api';

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [activeTab, setActiveTab] = useState<'sightings' | 'users'>('sightings');
  
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

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🔭 Observation System</h1>
        <div style={styles.tabs}>
          <button 
            style={{...styles.tab, ...(activeTab === 'sightings' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('sightings')}
          >
            Sightings
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {activeTab === 'users' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Add New User</h2>
              <form onSubmit={handleCreateUser} style={styles.form}>
                <input 
                  style={styles.input} 
                  placeholder="Full Name" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  required
                />
                <input 
                  style={styles.input} 
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
              <h3 style={styles.subtitle}>Registered Users ({users.length})</h3>
              <div style={styles.grid}>
                {users.map(user => (
                  <div key={user.id} style={styles.itemCard}>
                    <div style={styles.avatar}>{user.name.charAt(0)}</div>
                    <div>
                      <div style={styles.itemName}>{user.name}</div>
                      <div style={styles.itemMeta}>{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sightings' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Record Sighting</h2>
              <form onSubmit={handleCreateSighting} style={styles.form}>
                <select 
                  style={styles.input} 
                  value={newSighting.userId} 
                  onChange={e => setNewSighting({...newSighting, userId: e.target.value})}
                  required
                >
                  <option value="">Select Observer</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <input 
                  style={styles.input} 
                  placeholder="What did you see?" 
                  value={newSighting.description}
                  onChange={e => setNewSighting({...newSighting, description: e.target.value})}
                  required
                />
                <input 
                  style={styles.input} 
                  placeholder="Location" 
                  value={newSighting.location}
                  onChange={e => setNewSighting({...newSighting, location: e.target.value})}
                  required
                />
                <input 
                  style={styles.input} 
                  type="datetime-local" 
                  value={newSighting.dateTime}
                  onChange={e => setNewSighting({...newSighting, dateTime: e.target.value})}
                  required
                />
                <button type="submit" style={styles.button}>Record Sighting</button>
              </form>
            </div>

            <div style={styles.list}>
              <h3 style={styles.subtitle}>Recent Sightings ({sightings.length})</h3>
              {sightings.length === 0 ? <p style={styles.empty}>No sightings recorded yet.</p> : null}
              <div style={styles.timeline}>
                {sightings.map(sighting => (
                  <div key={sighting.id} style={styles.timelineItem}>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineHeader}>
                        <span style={styles.timelineUser}>
                          👤 {sighting.user?.name || 'Unknown'}
                        </span>
                        <span style={styles.timelineDate}>
                          {new Date(sighting.dateTime).toLocaleString()}
                        </span>
                      </div>
                      <h4 style={styles.timelineTitle}>{sighting.description}</h4>
                      <p style={styles.timelineLocation}>📍 {sighting.location}</p>
                      <button 
                        onClick={() => handleDeleteSighting(sighting.id)} 
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
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
  container: { maxWidth: '800px', margin: '0 auto' },
  header: { marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' },
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
    fontWeight: 600
  },
  activeTab: { background: '#fff', color: '#2563eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  main: { display: 'flex', flexDirection: 'column', gap: '20px' },
  section: { animation: 'fadeIn 0.3s ease-in' },
  card: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px' },
  cardTitle: { marginTop: 0, fontSize: '18px', color: '#334155' },
  form: { display: 'grid', gap: '12px' },
  input: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px'
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
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
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
  empty: { textAlign: 'center', color: '#94a3b8', padding: '40px' }
};

export default App;

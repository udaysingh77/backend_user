const API_URL = 'http://localhost:3000';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Sighting {
  id: number;
  description: string;
  dateTime: string;
  location: string;
  userId: number;
  user?: User;
}

export const api = {
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  createUser: async (data: { name: string; email: string }): Promise<User> => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getSightings: async (): Promise<Sighting[]> => {
    const res = await fetch(`${API_URL}/sightings`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  createSighting: async (data: { description: string; location: string; dateTime: string; userId: number }): Promise<Sighting> => {
    const res = await fetch(`${API_URL}/sightings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  deleteSighting: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/sightings/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(await res.text());
  }
};

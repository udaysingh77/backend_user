import * as sightingService from '../services/sighting.service';

export const getAll = async (req: any, res: any) => {
  try {
    const sightings = await sightingService.getAllSightings();
    res.status(200).json(sightings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sightings' });
  }
};

export const getOne = async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const sighting = await sightingService.getSightingById(id);
    if (!sighting) {
      return res.status(404).json({ error: 'Sighting not found' });
    }
    res.status(200).json(sighting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sighting' });
  }
};

export const create = async (req: any, res: any) => {
  try {
    const { description, dateTime, location, userId } = req.body;

    if (!description || !dateTime || !location || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sighting = await sightingService.createSighting({
      description,
      dateTime: new Date(dateTime), // 🔥 FIX HERE
      location,
      userId: Number(userId),
    });

    res.status(201).json(sighting);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid User ID' });
    }
    console.error(error); // 👈 ADD THIS
    res.status(500).json({ error: 'Failed to create sighting' });
  }
};


export const update = async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    // First check if exists
    const existing = await sightingService.getSightingById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Sighting not found' });
    }

    const updatedSighting = await sightingService.updateSighting(id, req.body);
    res.status(200).json(updatedSighting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sighting' });
  }
};

export const remove = async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    // First check if exists
    const existing = await sightingService.getSightingById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Sighting not found' });
    }

    await sightingService.deleteSighting(id);
    res.status(200).json({ message: 'Sighting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sighting' });
  }
};
import prisma from '../prisma/client';
import { CreateSightingInput, UpdateSightingInput } from '../models/types';

export const getAllSightings = async () => {
  return await prisma.sighting.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getSightingById = async (id: number) => {
  return await prisma.sighting.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const createSighting = async (data: CreateSightingInput) => {
  // Ensure date is a valid Date object
  const sightingDate = new Date(data.dateTime);
  
  return await prisma.sighting.create({
    data: {
      description: data.description,
      location: data.location,
      dateTime: sightingDate,
      userId: data.userId,
    },
  });
};

export const updateSighting = async (id: number, data: UpdateSightingInput) => {
  const updateData: any = { ...data };
  if (data.dateTime) {
    updateData.dateTime = new Date(data.dateTime);
  }

  return await prisma.sighting.update({
    where: { id },
    data: updateData,
  });
};

export const deleteSighting = async (id: number) => {
  return await prisma.sighting.delete({
    where: { id },
  });
};

import prisma from '../prisma/client';
import { CreateUserInput } from '../models/types';

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};

export const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      sightings: true,
    },
  });
};

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

export const updateUser = async (id: number, data: { name?: string; email?: string }) => {
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;

  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

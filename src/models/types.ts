export interface CreateSightingInput {
  description: string;
  dateTime: string | Date;
  location: string;
  userId: number;
}

export interface UpdateSightingInput {
  description?: string;
  dateTime?: string | Date;
  location?: string;
  userId?: number;
}

export interface CreateUserInput {
  email: string;
  name: string;
}

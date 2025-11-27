import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type RoleString = 'CUSTOMER' | 'ADMIN' | 'STAFF';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string;
  role: RoleString;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async ensureAdminSeed() {
    const adminEmail = 'admin@wdcomputer.test';
    const existing = await this.findByEmail(adminEmail);
    if (existing) return existing;

    // Create a default admin with a random password hash placeholder; in real setup you would
    // manage this via migrations or config.
    const passwordHash = '$2b$10$abcdefghijklmnopqrstuv'; // placeholder, not used in production
    return this.prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN'
      }
    });
  }
}
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

type RoleString = 'CUSTOMER' | 'ADMIN' | 'STAFF';

interface JwtPayload {
  sub: string;
  email: string;
  role: RoleString;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(email: string, password: string, name?: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      passwordHash,
      name,
      role: 'CUSTOMER'
    });

    return this.buildTokens(user.id, user.email, user.role as RoleString);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildTokens(user.id, user.email, user.role as RoleString);
  }

  private async buildTokens(userId: string, email: string, role: RoleString) {
    const payload: JwtPayload = { sub: userId, email, role };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: {
        id: userId,
        email,
        role
      }
    };
  }
}
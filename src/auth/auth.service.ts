import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { AccessTokenDto } from './dto/access-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user && user.password === password) {
      delete user.password;

      return user;
    }

    return null;
  }

  async login(user: Omit<User, 'password'>): Promise<AccessTokenDto> {
    const payload = { id: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

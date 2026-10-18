import prisma from '../config/prisma';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { hashPasswordMD5 } from '../utils/hash';
import { isEmailProviderAllowed } from '../utils/validator';
import { LoginModel, RegisterModel, UserDto } from '../types';

export class UserService {
  async register(data: RegisterModel) {
    const { name, surname, email, password } = data;

    if (!isEmailProviderAllowed(email)) {
      const error: any = new Error('Geçerli bir e-posta adresi sağlayıcısı kullanmalısınız.');
      error.status = 400;
      throw error;
    }

    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      const error: any = new Error('Bu kullanıcı zaten kayıtlı');
      error.status = 400;
      throw error;
    }

    const hashedPassword = hashPasswordMD5(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
        userImage: data.userImage || null
      }
    });

    return newUser;
  }

  async login(model: LoginModel) {
    const { email, password } = model;

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      const error: any = new Error('User not found.');
      error.status = 404;
      throw error;
    }

    const hashedPassword = hashPasswordMD5(password);
    if (user.password !== hashedPassword) {
      const error: any = new Error('Invalid password.');
      error.status = 401;
      throw error;
    }

    return this.generateJwtToken(user);
  }

  async getUsersAsync(currentUserId: number): Promise<UserDto | null> {
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        userImage: true
      }
    });

    return user;
  }

  async getUsersById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  }

  async getUserImage(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { userImage: true }
    });

    return user?.userImage || '';
  }

  async update(userDto: UserDto) {
    const user = await prisma.user.findUnique({
      where: { id: userDto.id }
    });

    if (!user) {
      const error: any = new Error('Kullanıcı bulunamadı');
      error.status = 404;
      throw error;
    }

    await prisma.user.update({
      where: { id: userDto.id },
      data: {
        name: userDto.name,
        surname: userDto.surname,
        email: userDto.email,
        userImage: userDto.userImage
      }
    });
  }

  private generateJwtToken(user: { id: number; name: string; surname: string; email: string }) {
    const payload = {
      sub: user.id.toString(),
      jti: crypto.randomUUID(),
      name: user.name,
      surname: user.surname,
      email: user.email
    };

    return jwt.sign(payload, config.jwt.key, {
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
      expiresIn: config.jwt.expiresIn as any
    });
  }
}

export const userService = new UserService();


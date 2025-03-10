// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Получаем роль по переданному roleId
        const role = await this.roleRepository.findOne({ where: { id: createUserDto.roleId } });
        if (!role) {
            throw new NotFoundException(`Роль с id ${createUserDto.roleId} не найдена`);
        }

        const user = this.userRepository.create({
            ...createUserDto,
            role, // теперь передаём объект Role, а не только его id
        });
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Пользователь с id ${id} не найден`);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // Если обновляется роль, получаем объект Role из БД по roleId
        if (updateUserDto.roleId) {
            const role = await this.roleRepository.findOne({ where: { id: updateUserDto.roleId } });
            if (!role) {
                throw new NotFoundException(`Роль с id ${updateUserDto.roleId} не найдена`);
            }
            updateUserDto = { ...updateUserDto, roleId:role.id };
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
}

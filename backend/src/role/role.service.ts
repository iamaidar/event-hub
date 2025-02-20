import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  async onModuleInit() {
    const rolesCount = await this.roleRepository.count();

    if (rolesCount === 0) {
      const roles: Role[] = [
        this.roleRepository.create({
          name: 'admin',
          description: 'Администратор',
        }),
        this.roleRepository.create({
          name: 'user',
          description: 'Пользователь',
        }),
        this.roleRepository.create({
          name: 'organizer',
          description: 'Организатор мероприятий',
        }),
      ];

      await this.roleRepository.save(roles);
    }
  }
}

// src/user/user.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "src/role/entities/role.entity";
import { FilterUserDto } from "./dto/filter-user.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationService } from "src/common/services/pagination.service";
import * as argon from "argon2";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getCurrentUser(req: any) {
    return req.user;
  }

  async filterUsersPaginated(
    filterDto: FilterUserDto,
    paginationDto: PaginationDto,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    // Деструктурируем фильтры из DTO
    const {
      username,
      firstname,
      lastname,
      gender,
      age,
      email,
      roleId,
      isActive,
      isSocial,
    } = filterDto;

    // Создаем Query Builder
    const query = this.userRepository
      .createQueryBuilder("users") // Алиас для таблицы users
      .leftJoinAndSelect("users.role", "roles"); // Присоединяем таблицу roles

    // Применяем фильтры
    if (username) {
      query.andWhere("users.username ILIKE :username", {
        username: `%${username}%`,
      });
    }
    if (firstname) {
      query.andWhere("users.firstname ILIKE :firstname", {
        firstname: `%${firstname}%`,
      });
    }
    if (lastname) {
      query.andWhere("users.lastname ILIKE :lastname", {
        lastname: `%${lastname}%`,
      });
    }
    if (gender) {
      query.andWhere("users.gender = :gender", { gender });
    }
    if (age) {
      query.andWhere("users.age = :age", { age });
    }
    if (email) {
      query.andWhere("users.email ILIKE :email", { email: `%${email}%` });
    }
    if (roleId) {
      query.andWhere("roles.id = :roleId", { roleId });
    }
    if (isActive !== undefined) {
      query.andWhere("users.is_active = :isActive", { isActive });
    }
    if (isSocial !== undefined) {
      query.andWhere("users.is_social = :isSocial", { isSocial });
    }

    return PaginationService.paginate(query, paginationDto);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const role = await this.roleRepository.findOne({
      where: { name: createUserDto.roleName },
    });
    if (!role) {
      throw new NotFoundException(`Роль ${createUserDto.roleName} не найдена`);
    }

    const hashedPassword = await argon.hash(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async findAllPaginated(paginationDto: PaginationDto): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const query = this.userRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.role", "roles");

    return PaginationService.paginate(query, paginationDto);
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

    if (updateUserDto.roleName) {
      const role = await this.roleRepository.findOne({
        where: { name: updateUserDto.roleName },
      });
      if (!role) {
        throw new NotFoundException(
          `Роль ${updateUserDto.roleName} не найдена`,
        );
      }

      user.role = role;
      if (updateUserDto.password && updateUserDto.password.trim() !== "") {
        user.password_hash = await argon.hash(updateUserDto.password);
      }
      user.updatedAt = new Date();
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}

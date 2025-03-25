import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "src/category/entities/category.entity";
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { Role } from "src/role/entities/role.entity";
import * as argon from "argon2";
import { faker } from "@faker-js/faker";
import { Review } from "../review/entities/review.entity";
import * as path from "path";
import * as fs from "fs/promises";
import * as mime from "mime-types";

@Injectable()
export class SeedService {
    private base64String: string;

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    // Создание ролей, если их ещё нет в БД
    async seedRoles(): Promise<Role[]> {
        const roleNames = ['admin', 'organizer', 'user'];
        const roles: Role[] = [];
        for (const name of roleNames) {
            let role = await this.roleRepository.findOne({ where: { name } });
            if (!role) {
                role = this.roleRepository.create({ name });
                role = await this.roleRepository.save(role);
            }
            roles.push(role);
        }
        return roles;
    }

    // Метод для создания одного тестового пользователя (оставляем для обратной совместимости)
    async seedUser(): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: { email: "example@mail.com" },
        });
        if (existingUser) return existingUser;

        const password = "123456";
        const hash = await argon.hash(password);
        const roles = await this.seedRoles();
        const userRole = roles.find(r => r.name === 'user');

        const user = this.userRepository.create({
            username: "user1",
            email: "example@mail.com",
            password_hash: hash,
            is_active: true,
            role: userRole, // связь с ролью через внешний ключ
        });
        return await this.userRepository.save(user);
    }

    // Метод для создания трёх пользователей: Админа, Организатора и Обычного пользователя
    async seedUsers(): Promise<User[]> {
        const users: User[] = [];
        const password = "123456";
        const hash = await argon.hash(password);

        // Обязательно создаём роли
        const roles = await this.seedRoles();
        const adminRole = roles.find(r => r.name === "admin");
        const organizerRole = roles.find(r => r.name === "organizer");
        const userRole = roles.find(r => r.name === "user");

        // Администратор
        let admin = await this.userRepository.findOne({ where: { email: "admin@mail.com" } });
        if (!admin) {
            admin = this.userRepository.create({
                username: "admin",
                email: "admin@mail.com",
                password_hash: hash,
                is_active: true,
                role: adminRole, // связь с ролью
            });
            admin = await this.userRepository.save(admin);
        }
        users.push(admin);

        // Организатор
        let organizer = await this.userRepository.findOne({ where: { email: "organizer@mail.com" } });
        if (!organizer) {
            organizer = this.userRepository.create({
                username: "organizer",
                email: "organizer@mail.com",
                password_hash: hash,
                is_active: true,
                role: organizerRole,
            });
            organizer = await this.userRepository.save(organizer);
        }
        users.push(organizer);

        // Обычный пользователь
        let user = await this.userRepository.findOne({ where: { email: "user@mail.com" } });
        if (!user) {
            user = this.userRepository.create({
                username: "user",
                email: "user@mail.com",
                password_hash: hash,
                is_active: true,
                role: userRole,
            });
            user = await this.userRepository.save(user);
        }
        users.push(user);

        return users;
    }

    // Создаем 5 заранее заданных категорий
    async seedCategories(): Promise<Category[]> {
        const categoryNames = ["Games", "Music", "Sports", "Technology", "Food"];
        const categories: Category[] = [];

        if (!this.base64String) {
            this.base64String = await this.convertImageToBase64("default.jpg");
        }

        for (const name of categoryNames) {
            // Проверяем, существует ли категория с таким именем
            let category = await this.categoryRepository.findOne({ where: { name } });
            if (!category) {
                category = this.categoryRepository.create({
                    name,
                    description: `${name} category description`,
                    is_verified: true,
                    image_base64: this.base64String,
                });
                category = await this.categoryRepository.save(category);
            }
            categories.push(category);
        }
        return categories;
    }

    // Создаем события с использованием сидированного организатора и категорий
    async seedEvents(count = 50): Promise<Event[]> {
        const events: Event[] = [];
        const users = await this.seedUsers();
        const organizer = users.find(u => u.role && u.role.name === "organizer");
        const categories = await this.seedCategories();

        if (!this.base64String) {
            this.base64String = await this.convertImageToBase64("default.jpg");
        }

        for (let i = 0; i < count; i++) {
            const event = this.eventRepository.create({
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                date_time: faker.date.future(),
                location: faker.location.city(),
                price: Number(faker.commerce.price({ min: 1000, max: 20000 })),
                total_tickets: faker.helpers.rangeToNumber({ min: 1, max: 4 }),
                status: faker.helpers.arrayElement([
                    "scheduled",
                    "cancelled",
                    "completed",
                ]),
                is_verified: faker.datatype.boolean(),
                organizer,
                category: categories.length
                    ? faker.helpers.arrayElement(categories)
                    : undefined,
                image_base64: this.base64String,
            });
            events.push(await this.eventRepository.save(event));
        }
        return events;
    }

    // Создаем отзывы для событий с участием обычного пользователя
    async seedReviews(count = 100): Promise<Review[]> {
        const reviews: Review[] = [];
        const users = await this.seedUsers();
        const normalUser = users.find(u => u.role && u.role.name === "user");
        let events = await this.eventRepository.find();

        if (events.length === 0) {
            events = await this.seedEvents();
        }

        for (let i = 0; i < count; i++) {
            const review = this.reviewRepository.create({
                rating: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
                comment: faker.lorem.sentence(),
                is_moderated: faker.datatype.boolean(),
                user: normalUser,
                event: faker.helpers.arrayElement(events),
            });
            reviews.push(await this.reviewRepository.save(review));
        }
        return reviews;
    }

    async runSeed() {
        await this.seedUsers();
        await this.seedCategories();
        await this.seedEvents();
        await this.seedReviews();
        return "Seeding completed";
    }

    async convertImageToBase64(imageName: string): Promise<string> {
        try {
            const imagePath = `${process.cwd()}/public/images/${imageName}`;
            console.log({ imagePath });
            const absolutePath = path.resolve(imagePath);
            await fs.access(absolutePath);
            const data = await fs.readFile(absolutePath);

            const base64Image = data.toString("base64");
            const mimeType = mime.lookup(imagePath) || "image/jpeg";
            const base64String = `data:${mimeType};base64,${base64Image}`;

            return base64String;
        } catch (error) {
            throw new Error(
                `Error while converting image to base64: ${error.message}`,
            );
        }
    }
}

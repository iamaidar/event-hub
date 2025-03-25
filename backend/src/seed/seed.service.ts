// seed/seed.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "src/category/entities/category.entity";
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
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
  ) {}

  // Создаём одного тестового пользователя
  async seedUser(): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: "example@mail.com" },
    });
    if (existingUser) return existingUser;
    async seedUser(): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: { email: 'example@mail.com' },
        });
        if (existingUser) return existingUser;

    const password = "123456";
    const hash = await argon.hash(password);
    const user = this.userRepository.create({
      username: "user1",
      email: "example@mail.com",
      password_hash: hash,
      is_active: true,
    });
    return await this.userRepository.save(user);
  }
        const password = '123456';
        const hash = await argon.hash(password);
        const role = await this.roleRepository.findOne({ where: { name: 'admin' } });
        if (!role) throw new NotFoundException(`User admin doesn't exist}`);
        const user = this.userRepository.create({
            username: 'user1',
            email: 'example@mail.com',
            password_hash: hash,
            is_active: true,
            role: role, // default
        });
        return await this.userRepository.save(user);
    }

  // Создаем 5 заранее заданных категорий
  async seedCategories(): Promise<Category[]> {
    const categoryNames = ["Games", "Music", "Sports", "Technology", "Food"];
    const categories: Category[] = [];
    async seedUsersWithRoles(): Promise<User[]> {
        const users: User[] = [];
        const roleNames = ['user', 'organizer'];

        for (const roleName of roleNames) {
            const role = await this.roleRepository.findOne({ where: { name: roleName } });
            if (!role) {
                throw new Error(`Role "${roleName}" not found`);
            }

            const email = `${roleName}@mail.com`;
            let user = await this.userRepository.findOne({ where: { email } });

            if (!user) {
                const hash = await argon.hash('123456');
                user = this.userRepository.create({
                    username: `${roleName}_test`,
                    email,
                    password_hash: hash,
                    is_active: true,
                    role,
                });
                user = await this.userRepository.save(user);
            }

            users.push(user);
        }

        return users;
    }

    async seedCategories(): Promise<Category[]> {
        const categoryNames = ['Games', 'Music', 'Sports', 'Technology', 'Food'];
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
        for (const name of categoryNames) {
            let category = await this.categoryRepository.findOne({ where: { name } });
            if (!category) {
                category = this.categoryRepository.create({
                    name,
                    description: `${name} category description`,
                    is_verified: true,
                });
                category = await this.categoryRepository.save(category);
            }
            categories.push(category);
        }
        return categories;
    }

  // Создаем события с использованием сидированного пользователя и категорий
  async seedEvents(count = 50): Promise<Event[]> {
    const events: Event[] = [];
    const organizer = await this.seedUser();
    const categories = await this.seedCategories();
    async seedEvents(count = 50): Promise<Event[]> {
        const events: Event[] = [];
        const organizer = (await this.seedUsersWithRoles()).find((u) => u.role.name === 'organizer');
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
        for (let i = 0; i < count; i++) {
            const event = this.eventRepository.create({
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                date_time: faker.date.future(),
                location: faker.address.city(),
                price: Number(faker.commerce.price({ min: 1000, max: 20000 })),
                total_tickets: faker.helpers.rangeToNumber({ min: 1, max: 4 }),
                status: faker.helpers.arrayElement(['scheduled', 'cancelled', 'completed']),
                is_verified: faker.datatype.boolean(),
                organizer,
                category: categories.length ? faker.helpers.arrayElement(categories) : undefined,
            });
            events.push(await this.eventRepository.save(event));
        }
        return events;
    }

  // Создаем отзывы для событий
  async seedReviews(count = 100): Promise<Review[]> {
    const reviews: Review[] = [];
    const user = await this.seedUser();
    const events = await this.eventRepository.find();
    async seedReviews(count = 100): Promise<Review[]> {
        const reviews: Review[] = [];
        const user = (await this.seedUsersWithRoles()).find((u) => u.role.name === 'user');
        const events = await this.eventRepository.find();

    if (events.length === 0) {
      await this.seedEvents();
    }

    for (let i = 0; i < count; i++) {
      const review = this.reviewRepository.create({
        rating: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
        is_moderated: faker.datatype.boolean(),
        user,
        event: faker.helpers.arrayElement(events),
      });
      reviews.push(await this.reviewRepository.save(review));
    }
    return reviews;
  }

  async runSeed() {
    await this.seedUser();
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

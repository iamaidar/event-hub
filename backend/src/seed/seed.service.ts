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
  private defaultUserImageBase64: string;
  private defaultImageBase64: string;

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

    if (!this.defaultUserImageBase64) {
      this.defaultImageBase64 = await this.convertImageToBase64("user.png");
    }

    const password = "123456";
    const hash = await argon.hash(password);
    const user = this.userRepository.create({
      username: "user1",
      email: "example@mail.com",
      password_hash: hash,
      is_active: true,
      avatar_base64: this.defaultUserImageBase64,
      avatar_mime_type: "image/png",
    });
    return await this.userRepository.save(user);
  }

  // Создаем 5 заранее заданных категорий
  async seedCategories(): Promise<Category[]> {
    const categoryNames = ["Games", "Music", "Sports", "Technology", "Food"];
    const categories: Category[] = [];

    if (!this.defaultImageBase64) {
      this.defaultImageBase64 = await this.convertImageToBase64("default.jpg");
    }

    for (const name of categoryNames) {
      // Проверяем, существует ли категория с таким именем
      let category = await this.categoryRepository.findOne({ where: { name } });
      if (!category) {
        category = this.categoryRepository.create({
          name,
          description: `${name} category description`,
          is_verified: true,
          image_base64: this.defaultImageBase64,
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

    if (!this.defaultImageBase64) {
      this.defaultImageBase64 = await this.convertImageToBase64("default.jpg");
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
        image_base64: this.defaultImageBase64,
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

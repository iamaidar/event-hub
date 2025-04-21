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
import { EventStatus } from "../event/event-status.enum";
import {Stripe} from "stripe";
import {Ticket} from "../ticket/entities/ticket.entity";
import {Order} from "../order/entities/order.entity";
const TICKET_PRICE_MIN = 1_000;
const TICKET_PRICE_MAX = 3_000;                // верхний порог

const ORDER_STATUSES = ['pending', 'confirmed', 'cancelled', 'refunded'] as const;


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
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  // Создаём одного тестового пользователя
  async seedUser(): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: "example@mail.com" },
    });
    if (existingUser) return existingUser;

    if (!this.defaultUserImageBase64) {
      this.defaultUserImageBase64 = await this.convertImageToBase64("user.png");
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

    const possibleStatuses: EventStatus[] = [
      EventStatus.PENDING,
      EventStatus.PUBLISHED,
      EventStatus.COMPLETED,
      EventStatus.CANCELLED,
      EventStatus.INACTIVE,
      EventStatus.DELETED,
    ];

    for (let i = 0; i < count; i++) {
      const status = faker.helpers.arrayElement(possibleStatuses);

      // is_verified зависит от статуса: только опубликованные и completed - true
      const is_verified = [
        EventStatus.PUBLISHED,
        EventStatus.COMPLETED,
      ].includes(status)
        ? true
        : faker.datatype.boolean();

      const event = this.eventRepository.create({
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        date_time: faker.date.future(),
        location: faker.location.city(),
        price: faker.number.int({ min: TICKET_PRICE_MIN, max: TICKET_PRICE_MAX }),
        total_tickets: faker.helpers.rangeToNumber({ min: 10, max: 200 }),
        status,
        is_verified,
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

  private async seedTickets(
      order: Order,
      event: Event,
      qty: number,
  ) {
    const tickets: Ticket[] = [];

    for (let i = 0; i < qty; i++) {
      const ticketCode = faker.string.alphanumeric({ length: 10, casing: 'upper' });
      const secretCode = faker.string.numeric({ length: 5 });
      const qrData = Buffer.from(`${ticketCode}:${event.id}`).toString('base64'); // демо‑QR

      tickets.push(
          this.ticketRepository.create({
            order,
            ticket_code: ticketCode,
            qr_code_data: qrData,
            secret_code: secretCode,
            is_used: false,
          }),
      );
    }

    await this.ticketRepository.save(tickets);
  }

  // Создаём заказы с билетами
  private async seedOrders(count = 100): Promise<Order[]> {
    const orders: Order[] = [];
    const buyer = await this.seedUser();                         // Test‑пользователь
    const events = await this.eventRepository.find({
      where: { status: EventStatus.PUBLISHED },
    });
    if (!events.length) await this.seedEvents();                 // safety net

    for (let i = 0; i < count; i++) {
      const event = faker.helpers.arrayElement(events);
      if (event.total_tickets === 0) continue;

      const ticketsQty = Math.min(
          faker.number.int({ min: 1, max: 5 }),
          event.total_tickets,
      );

      const order = this.orderRepository.create({
        user: buyer,
        event,
        ticket_count: ticketsQty,
        total_amount: Number((event.price * ticketsQty).toFixed(2)),
        status: faker.helpers.arrayElement(ORDER_STATUSES),
        stripe_payment_id: faker.string.uuid(),
        createdAt: faker.date.recent({ days: 60 }),
      });
      await this.orderRepository.save(order);

      // уменьшаем остаток билетов у события
      event.total_tickets -= ticketsQty;
      await this.eventRepository.save(event);

      await this.seedTickets(order, event, ticketsQty);          // ← билеты

      orders.push(order);
    }
    return orders;
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
    await this.seedOrders();
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

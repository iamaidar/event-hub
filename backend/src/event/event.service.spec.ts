// event.service.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventService } from "./event.service";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { Category } from "../category/entities/category.entity";
import { Order } from "../order/entities/order.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { EventStatus } from "./event-status.enum";
import { User } from "src/user/entities/user.entity";

function createMockRepo<T = any>() {
  return {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    softDelete: vi.fn(),
    update: vi.fn(),
    createQueryBuilder: vi.fn(() => ({
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      getRawMany: vi.fn().mockResolvedValue([]),
    })),
  };
}

describe("EventService", () => {
  let service: EventService;
  let mockEventRepo: ReturnType<typeof createMockRepo>;
  let mockCategoryRepo: ReturnType<typeof createMockRepo>;
  let mockOrderRepo: ReturnType<typeof createMockRepo>;

  beforeEach(() => {
    mockEventRepo = createMockRepo();
    mockCategoryRepo = createMockRepo();
    mockOrderRepo = createMockRepo();

    const calendarService = {
      createEvent: vi.fn().mockResolvedValue({ success: true }),
    };

    service = new EventService(
      mockEventRepo as unknown as Repository<Event>,
      mockCategoryRepo as unknown as Repository<Category>,
      mockOrderRepo as unknown as Repository<Order>,
      calendarService as any,
    );
  });

  describe("findOne", () => {
    it("should return the event by ID", async () => {
      mockEventRepo.findOne.mockResolvedValueOnce({ id: 1 });

      const result = await service.findOne("1");

      expect(result).toEqual({ id: 1 });
      expect(mockEventRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["category", "organizer"],
      });
    });

    it("should throw NotFoundException if event not found", async () => {
      mockEventRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should throw BadRequest if base64 image is invalid", async () => {
      const dto: any = {
        image_base64: "invalid",
        price: "10",
        total_tickets: "100",
        categoryId: 1,
        date_time: new Date().toISOString(),
      };
      const user = { id: 1 };

      await expect(service.create(dto, user as User)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw NotFoundException if category not found", async () => {
      const dto: any = {
        image_base64: Buffer.from("img").toString("base64"),
        price: "10",
        total_tickets: "100",
        categoryId: 1,
        date_time: new Date().toISOString(),
      };
      const user = { id: 1 };

      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.create(dto, user as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should create and return new event", async () => {
      const dto: any = {
        image_base64: Buffer.from("img").toString("base64"),
        price: "10",
        total_tickets: "100",
        categoryId: 1,
        date_time: new Date().toISOString(),
        title: "Test Event",
      };
      const user = { id: 1 };

      const mockCategory = { id: 1, name: "Test" };
      const mockSaved = { id: 123, title: "Test Event" };

      mockCategoryRepo.findOne.mockResolvedValue(mockCategory);
      mockEventRepo.create.mockReturnValue(dto);
      mockEventRepo.save.mockResolvedValue(mockSaved);

      const result = await service.create(dto, user as User);

      expect(mockEventRepo.create).toHaveBeenCalled();
      expect(mockEventRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockSaved);
    });
  });

  describe("remove", () => {
    it("should remove event", async () => {
      mockEventRepo.findOne.mockResolvedValue({ id: 1 });

      await service.remove("1");

      expect(mockEventRepo.softDelete).toHaveBeenCalledWith("1");
    });

    it("should throw if event not found", async () => {
      mockEventRepo.findOne.mockResolvedValue(null);

      await expect(service.remove("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("getAvailableTicketsCountAndPrice", () => {
    it("should calculate available tickets correctly", async () => {
      mockEventRepo.findOne.mockResolvedValue({
        id: 1,
        total_tickets: 100,
        price: 50,
      });
      mockOrderRepo.find.mockResolvedValue([
        { ticket_count: 20, status: "confirmed" },
        { ticket_count: 10, status: "confirmed" },
      ]);

      const result = await service.getAvailableTicketsCountAndPrice(1);

      expect(result).toEqual({ availableTickets: 70, ticketPrice: 50 });
    });
  });

  describe("getAllLocations", () => {
    it("should return unique locations", async () => {
      const mockQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        getRawMany: vi
          .fn()
          .mockResolvedValue([{ location: "Bishkek" }, { location: "Osh" }]),
      };

      mockEventRepo.createQueryBuilder = vi
        .fn()
        .mockReturnValue(mockQueryBuilder);

      const result = await service.getAllLocations();

      expect(result).toEqual(["Bishkek", "Osh"]);
    });
  });
});

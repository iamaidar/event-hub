import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { User } from "./entities/user.entity";
import { Roles } from "src/auth/decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FilterUserDto } from "./dto/filter-user.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller("users")
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("get-me")
  getCurrentUser(@Req() req: any) {
    return this.userService.getCurrentUser(req);
  }

  @Roles("admin")
  @Get("filter")
  filterUsersPaginated(
    @Query() filterDto: FilterUserDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.userService.filterUsersPaginated(filterDto, paginationDto);
  }

  @Roles("admin")
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles("admin")
  @Get()
  findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.userService.findAllPaginated(paginationDto);
  }

  @Roles("admin")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Roles("admin")
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}

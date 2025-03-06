import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { GetUser } from "src/auth/decorator";
import { User } from "./entities/user.entity";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorator/roles.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
  @UseGuards(JwtGuard)
  @Get("me")
  getMe(@GetUser("") user: User, @GetUser("email") email: string) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Get()
  test() {
    return "test";
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get("admin")
  @Roles("admin")
  @ApiBearerAuth()
  admin() {
    return "you are admin";
  }
}

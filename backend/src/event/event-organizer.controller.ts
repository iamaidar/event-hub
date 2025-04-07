import {
    Controller,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Request,
    UseGuards,
    Get, Query, Logger,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from '../event/dto/create-event.dto';
import { UpdateEventDto } from '../event/dto/update-event.dto';
import { JwtGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {PaginationDto} from "../common/dto/pagination.dto";

@ApiTags('Organizer Events')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Roles('organizer')
@Controller('organizer/events')
export class OrganizerEventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new event as organizer' })
    @ApiResponse({ status: 201, description: 'Event successfully created and pending verification.' })
    create(@Body() dto: CreateEventDto, @Request() req) {
        return this.eventService.createByOrganizer(dto, req.user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an event (resets verification status)' })
    @ApiResponse({ status: 200, description: 'Event updated and marked for re-verification.' })
    update(@Param('id') id: number, @Body() dto: UpdateEventDto) {
        return this.eventService.updateByOrganizer(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete an event (deactivates and un-verifies)' })
    @ApiResponse({ status: 200, description: 'Event marked as inactive and pending re-verification.' })
    softDelete(@Param('id') id: number) {
        return this.eventService.softRemoveByOrganizer(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all events belonging to the current organizer' })
    @ApiResponse({ status: 200, description: 'List of events created by the organizer.' })
    getAll(@Request() req,
           @Query() paginationDto: PaginationDto, ) {
        return this.eventService.getEventsByOrganizer(req.user['id'],paginationDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event details including sold tickets and orders count' })
    @ApiResponse({ status: 200, description: 'Returns event details with ticket purchase and order information.' })
    getEventDetails(@Param('id') id: number) {
        return this.eventService.getEventDetailsById(id);
    }

}

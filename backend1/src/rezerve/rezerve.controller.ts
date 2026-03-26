import { Controller, Get, Post, Body, Param, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { RezerveService } from './rezerve.service';
import { CreateRezerveDto } from './dto/create-rezerve.dto';
import { UpdateRezerveDto } from './dto/update-rezerve.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rezerve')
export class RezerveController {
  constructor(private readonly rezerveService: RezerveService) {}

  @Post()
  create( @Request() req ,@Body() createRezerveDto: CreateRezerveDto) {
    return this.rezerveService.create(req,createRezerveDto);
  }

  @Get()
  findAll() {
    return this.rezerveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rezerveService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRezerveDto: UpdateRezerveDto) {
    return this.rezerveService.update(id, updateRezerveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rezerveService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';


@Controller('table')
@UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) { }

  @Post()
  async create(@Body() createTableDto: CreateTableDto) {
    return await this.tablesService.create(createTableDto);
  }

  @Get()
  async findAll() {
    return await this.tablesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tablesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return await this.tablesService.update(id, updateTableDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tablesService.remove(id);
  }
  @Post("reassign")
  async reassignTables(
    @Body() body: { oldTableId: string; newTableId: string; orderId: string }
  ) {
    return this.tablesService.reassignTables(body);
  }
}

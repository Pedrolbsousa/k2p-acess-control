import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from '../dto/create-package.dto';

@Controller('portaria/packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  create(@Body() dto: CreatePackageDto, @TenantId() tenantId: string) {
    return this.packagesService.create(dto, tenantId);
  }

  @Get()
  list(@Query('status') status: string, @TenantId() tenantId: string) {
    return this.packagesService.list(tenantId, { status });
  }

  @Post(':id/deliver')
  deliver(@Param('id') id: string, @TenantId() tenantId: string, @Req() req: any) {
    return this.packagesService.deliver(id, tenantId, req.user.sub);
  }
}
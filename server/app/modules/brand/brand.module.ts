/** Dependencies **/
import 'reflect-metadata';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { OnModuleInit } from '@nestjs/common/interfaces/modules';
import { Module, MiddlewaresConsumer, NestModule } from '@nestjs/common';

/** Modules **/
import { CQRSModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database/database.module';

const modules = [
  CQRSModule,
  DatabaseModule,
];

/** Services **/
import { BrandService } from './services/brand.service';

const services = [
  BrandService,
];

/** Resolvers **/
import { BrandResolvers } from './resolvers/brand.resolvers';

const resolvers = [
  BrandResolvers,
];

/** Command handlers **/
import { CreateBrandHandler } from './commands/handlers/create-brand.handler';
import { UpdateBrandHandler } from './commands/handlers/update-brand.handler';
import { DeleteBrandHandler } from './commands/handlers/delete-brand.handler';

const commandHandlers = [
  CreateBrandHandler,
  UpdateBrandHandler,
  DeleteBrandHandler,
];

/** Repositories **/
import { BrandRepository } from './repositories/brand.repository';

const repositories = [
  BrandRepository,
];

@Module({
  imports: [
    ...modules,
  ],
  controllers: [],
  components: [
    ...commandHandlers,
    ...repositories,
    ...resolvers,
    ...services,
  ],
  exports: [
    ...repositories,
    ...services,
  ],
})
export class BrandModule implements NestModule, OnModuleInit {

  constructor(private readonly event$: EventBus,
              private readonly command$: CommandBus,
              private readonly moduleRef: ModuleRef) {
  }

  public onModuleInit(): void {
    this.event$.setModuleRef(this.moduleRef);
    this.command$.setModuleRef(this.moduleRef);

    this.command$.register(commandHandlers);
  }

  public configure(consumer: MiddlewaresConsumer): void {
  }

}

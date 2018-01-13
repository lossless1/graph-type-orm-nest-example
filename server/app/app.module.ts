/** Dependencies **/
import 'reflect-metadata';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import { GraphQLFactory } from '@nestjs/graphql';
import { OnModuleInit } from '@nestjs/common/interfaces/modules';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { Module, MiddlewaresConsumer, NestModule, RequestMethod, Inject } from '@nestjs/common';

/** Config **/
import { AppConfig } from '../config/app.config';

const config = [
  AppConfig,
];

/** Modules **/
import { GraphQLModule } from '@nestjs/graphql';
import { BrandModule } from './modules/brand/brand.module';
import { DatabaseModule } from './modules/database/database.module';

const modules = [
  GraphQLModule,
  BrandModule,
  DatabaseModule,
];

/** Middlewares **/
import { CorsMiddleware } from '@nest-middlewares/cors';
import { HelmetMiddleware } from '@nest-middlewares/helmet';

@Module({
  imports: [
    ...modules,
  ],
  controllers: [],
  components: [
    ...config,
  ],
  exports: [],
})
export class AppModule implements NestModule, OnModuleInit {

  constructor(private readonly graphQLFactory: GraphQLFactory,
              @Inject('AppConfig') private readonly appConfig: AppConfig) {
  }

  public async onModuleInit(): Promise<void> {
    if (this.appConfig.environment !== 'test') {
      console.log('----------------------------------------------------------------------------------------------');
      console.log('-----------------------------------------GraphTypeORM-----------------------------------------');
      console.log('----------------------------------------------------------------------------------------------');
    }
  }

  public configure(consumer: MiddlewaresConsumer) {
    this.applyMiddlewares(consumer).applyGraphQL(consumer);
  }

  private applyMiddlewares(consumer: MiddlewaresConsumer): this {
    CorsMiddleware.configure({});
    HelmetMiddleware.configure({});

    consumer
      .apply([CorsMiddleware, HelmetMiddleware])
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });

    return this;
  }

  private applyGraphQL(consumer: MiddlewaresConsumer): this {
    const schema = this.createSchema();

    consumer
      .apply(graphiqlExpress({
        endpointURL: '/graphql',
        editorTheme: 'default',
      }))
      .forRoutes({
        path: '/graphiql',
        method: RequestMethod.GET,
      });

    consumer
      .apply(graphqlExpress(req => ({
        schema: schema,
        rootValue: req,
        debug: false,
      })))
      .forRoutes({
        path: '/graphql',
        method: RequestMethod.ALL,
      });

    return this;
  }

  private createSchema(): GraphQLSchema {
    const schema = this.graphQLFactory.createSchema({
      typeDefs: [
        this.graphQLFactory.mergeTypesByPaths('./**/*.graphqls'),
      ],
    });

    const delegates = this.graphQLFactory.createDelegates();

    return mergeSchemas({
      schemas: [schema],
      resolvers: delegates,
    });
  }

}

/** Dependencies **/
import { CustomValue } from '@nestjs/core/injector/module';

interface IAppConfig {
  environment: 'dev' | 'test' | 'prod';
  server: {
    port: number;
  };
}

export const AppConfig: CustomValue = {
  name: 'AppConfig',
  provide: 'AppConfig',
  useValue: <IAppConfig> {
    environment: <'dev' | 'test' | 'prod'>process.env.ENVIRONMENT,
    server: {
      port: Number(process.env.PORT),
    },
  },
};

export type AppConfig = IAppConfig;

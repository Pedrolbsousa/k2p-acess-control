import { Module } from "@nestjs/common";
//import { PrismaService } from "./prisma.service";

@Module({
  //providers: [PrismaService],  //at async InstanceLoader.createInstancesOfProviders (D:\K2P v1.0\k2p-acess-control\node_modules\@nestjs\core\injector\instance-loader.js:55:9) { clientVersion: '7.4.1', errorCode: undefined, retryable: undefined
  //exports: [PrismaService], //[Nest] 10848  - 19/02/2026, 16:34:40   ERROR [ExceptionHandler] UnknownExportException [Error]: Nest cannot export a provider/module that is not a part of the currently processed module (PrismaModule). Please ve
})
export class PrismaModule {}

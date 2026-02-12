import { Controller, Get, Req } from "@nestjs/common";

@Controller()
export class TestController {
  @Get("me")
  me(@Req() req: any) {
    return req.user;
  }

  @Get("ping")
  ping() {
    return { ok: true };
  }
}

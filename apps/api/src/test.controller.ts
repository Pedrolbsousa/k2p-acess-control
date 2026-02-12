import { Controller, Get, Req } from "@nestjs/common";
import { Public } from "./auth/public.decorator";
import { Roles } from "./auth/roles.decorator";

@Controller()
export class TestController {
    @Public()
    @Get("ping")
    ping() {
        return { ok: true };
    }

    @Get("me")
    me(@Req() req: any) {
        return req.user;
    }

    @Roles("PORTARIA")
    @Public()
    @Get("portaria-only")
    portariaOnly() {
        return { ok: true };
    }
}

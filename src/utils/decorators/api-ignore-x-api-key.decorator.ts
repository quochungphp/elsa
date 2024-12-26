import { SetMetadata } from "@nestjs/common";
export const IgnoreXApiKey = () => SetMetadata("ignoreXApiKey", true);

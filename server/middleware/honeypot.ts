import { defineHandler } from "nitro/h3";
import { honeypot } from "../honeypot";

export default defineHandler((event) => honeypot(event.req));

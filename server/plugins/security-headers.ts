import { definePlugin } from "nitro";
import { securityHeaders } from "../security-headers";

export default definePlugin((nitro) => {
  // SSR 404/error responses can replace headers set before rendering.
  nitro.hooks.hook("response", (response) => {
    for (const [name, value] of Object.entries(securityHeaders)) {
      response.headers.set(name, value);
    }
  });
});

import { baseProcedure } from "@scinorandex/erpc";
import { Router } from "@scinorandex/rpscin";

export const unTypeSafeRouter = Router("/").config({
  "/status": {
    get: baseProcedure.use(async () => {
      return {
        status: "ok",
        time: Date.now(),
        timePH: new Date().toLocaleString("en-PH"),
      };
    }),
  },
});

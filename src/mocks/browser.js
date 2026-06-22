import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/authHandlers";
import { teamHandlers } from "./handlers/teamHandlers";
import { productHandlers } from "./handlers/productHandlers";
import { articleHandlers } from "./handlers/articleHandlers";
import { settingsHandlers } from "./handlers/settingsHandlers";
import { statsHandlers } from "./handlers/statsHandlers";

export const worker = setupWorker(
  ...authHandlers,
  ...teamHandlers,
  ...productHandlers,
  ...articleHandlers,
  ...settingsHandlers,
  ...statsHandlers,
);

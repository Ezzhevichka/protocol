import type { User as UserType, AgentDevice } from "@squad-admin/database";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserType {}

    interface Request {
      agentDevice?: AgentDevice;
    }
  }
}

export {};
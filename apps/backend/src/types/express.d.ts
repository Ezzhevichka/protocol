import type { User as UserType } from "@squad-admin/database";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserType {}
  }
}

export {};
import type { User as UserType } from '@squad-admin/database';

declare global {
    namespace Express {

        interface User extends UserType {}
    }
}

export {};

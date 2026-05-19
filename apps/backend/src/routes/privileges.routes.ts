import { Router } from 'express';

import {
    createPrivilegeController,
    deletePrivilegeController,
    listPrivilegeGroupsController,
    listPrivilegesController,
    updatePrivilegeController,
    updatePrivilegeGroupController,
} from '../controllers/privileges.controller';
import { validateBody } from '../middleware/validate.middleware';
import {
    createPrivilegeSchema,
    updatePrivilegeGroupSchema,
    updatePrivilegeSchema,
} from '../schemas/privileges.schema';

const router = Router();

router.get('/groups', listPrivilegeGroupsController);
router.patch(
    '/groups/:id',
    validateBody(updatePrivilegeGroupSchema),
    updatePrivilegeGroupController
);
router.get('/players', listPrivilegesController);
router.post('/players', validateBody(createPrivilegeSchema), createPrivilegeController);
router.patch('/players/:id', validateBody(updatePrivilegeSchema), updatePrivilegeController);
router.delete('/players/:id', deletePrivilegeController);

export default router;

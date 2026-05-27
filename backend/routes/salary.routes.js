const router = require('express').Router();
const { Salary } = require('../models');
const crud = require('../controllers/crud.factory');
const { protect, authorize } = require('../middleware/auth');
const c = crud(Salary, 'playerId');

router.use(protect);
router.get('/', authorize('administrator', 'accountant'), c.list);
router.get('/:id', authorize('administrator', 'accountant'), c.get);
router.post('/', authorize('administrator', 'accountant'), c.create);
router.put('/:id', authorize('administrator', 'accountant'), c.update);
router.delete('/:id', authorize('administrator', 'accountant'), c.remove);

module.exports = router;

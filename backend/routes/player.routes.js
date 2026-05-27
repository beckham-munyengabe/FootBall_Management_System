const router = require('express').Router();
const { Player } = require('../models');
const crud = require('../controllers/crud.factory');
const { protect, authorize } = require('../middleware/auth');
const c = crud(Player, 'user');

router.use(protect);
router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', authorize('administrator'), c.create);
router.put('/:id', authorize('administrator'), c.update);
router.delete('/:id', authorize('administrator'), c.remove);

module.exports = router;

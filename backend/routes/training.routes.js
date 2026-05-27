const router = require('express').Router();
const { TrainingSchedule } = require('../models');
const crud = require('../controllers/crud.factory');
const { protect, authorize } = require('../middleware/auth');
const c = crud(TrainingSchedule, 'players');

router.use(protect);
router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', authorize('administrator', 'coach'), c.create);
router.put('/:id', authorize('administrator', 'coach'), c.update);
router.delete('/:id', authorize('administrator', 'coach'), c.remove);

module.exports = router;

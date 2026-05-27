const router = require('express').Router();
const { Match } = require('../models');
const crud = require('../controllers/crud.factory');
const { protect, authorize } = require('../middleware/auth');
const c = crud(Match, 'lineup');

router.use(protect);
router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', authorize('administrator', 'coach'), c.create);
router.put('/:id', authorize('administrator', 'coach'), c.update);
router.delete('/:id', authorize('administrator'), c.remove);

module.exports = router;

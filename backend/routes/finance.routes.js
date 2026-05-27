const router = require('express').Router();
const { Finance } = require('../models');
const crud = require('../controllers/crud.factory');
const { protect, authorize } = require('../middleware/auth');
const c = crud(Finance);

router.use(protect);
router.get('/', authorize('administrator', 'accountant'), c.list);
router.get('/report/summary', authorize('administrator', 'accountant'), async (req, res) => {
  try {
    const data = await Finance.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const byCategory = await Finance.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);
    res.json({ totals: data, byCategory });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/:id', authorize('administrator', 'accountant'), c.get);
router.post('/', authorize('administrator', 'accountant'), c.create);
router.put('/:id', authorize('administrator', 'accountant'), c.update);
router.delete('/:id', authorize('administrator', 'accountant'), c.remove);

module.exports = router;

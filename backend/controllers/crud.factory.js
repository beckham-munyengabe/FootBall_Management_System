// Generic CRUD controller factory
const crud = (Model, populate = null) => ({
  list: async (req, res) => {
    try {
      let q = Model.find(req.query.filter ? JSON.parse(req.query.filter) : {});
      if (populate) q = q.populate(populate);
      const items = await q.sort({ createdAt: -1 });
      res.json(items);
    } catch (err) { res.status(500).json({ message: err.message }); }
  },
  get: async (req, res) => {
    try {
      let q = Model.findById(req.params.id);
      if (populate) q = q.populate(populate);
      const item = await q;
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) { res.status(500).json({ message: err.message }); }
  },
  create: async (req, res) => {
    try {
      const body = { ...req.body };
      if (req.user) body.recordedBy = body.recordedBy || req.user._id;
      const item = await Model.create(body);
      res.status(201).json(item);
    } catch (err) { res.status(400).json({ message: err.message }); }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) { res.status(400).json({ message: err.message }); }
  },
  remove: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
  },
});

module.exports = crud;

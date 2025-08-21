const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Clear model cache (prevents model overwrite errors during dev/hot-reload)
mongoose.models = {};
mongoose.modelSchemas = {};

// Models for your MongoDB collections (match Atlas names exactly)
const ExtraFormulas = mongoose.model(
  'extraFormulasObject',
  new mongoose.Schema({}, { strict: false }),
  'extraFormulasObject'
);
const NCCAOMFormulas = mongoose.model(
  'NCCAOMFormulasObject',
  new mongoose.Schema({}, { strict: false }),
  'NCCAOMFormulasObject'
);
const NCCAOMHerbs = mongoose.model(
  'NCCAOMHerbsObject',
  new mongoose.Schema({}, { strict: false }),
  'NCCAOMHerbsObject'
);
const CALEAndNCCAOMFormulas = mongoose.model(
  'caleAndNCCAOMFormulasObject',
  new mongoose.Schema({}, { strict: false }),
  'caleAndNCCAOMFormulasObject'
);
const CALEAndNCCAOMHerbs = mongoose.model(
  'caleAndNCCAOMHerbsObject',
  new mongoose.Schema({}, { strict: false }),
  'caleAndNCCAOMHerbsObject'
);
const CaleHerbs = mongoose.model(
  'caleHerbsObject',
  new mongoose.Schema({}, { strict: false }),
  'caleHerbsObject'
);
const ExtraHerbs = mongoose.model(
  'extraHerbsObject',
  new mongoose.Schema({}, { strict: false }),
  'extraHerbsObject'
);
const FormulaCategoryList = mongoose.model(
  'formulaCategoryListObject',
  new mongoose.Schema({}, { strict: false }),
  'formulaCategoryListObject'
);
const HerbCategoryList = mongoose.model(
  'herbCategoryListObject',
  new mongoose.Schema({}, { strict: false }),
  'herbCategoryListObject'
);
// PATCH: fix typo in endpoint/model name to match frontend and MongoDB Atlas
const HerbGroupsList = mongoose.model(
  'herbGroupsList',
  new mongoose.Schema({}, { strict: false }),
  'herbGroupsList'
);

// Utility to get model by name
const models = {
  extraformulas: ExtraFormulas,
  nccaomformulas: NCCAOMFormulas,
  nccaomherbs: NCCAOMHerbs,
  caleandnccaomformulas: CALEAndNCCAOMFormulas,
  caleandnccaomherbs: CALEAndNCCAOMHerbs,
  caleherbs: CaleHerbs,
  extraherbs: ExtraHerbs,
  formulacategorylist: FormulaCategoryList,
  herbcategorylist: HerbCategoryList,
  herbgroupslist: HerbGroupsList
};

// GET endpoints for each collection
router.get('/extraformulas', async (req, res) => {
  const data = await ExtraFormulas.find({});
  res.json(data);
});
router.get('/nccaomformulas', async (req, res) => {
  const data = await NCCAOMFormulas.find({});
  res.json(data);
});
router.get('/nccaomherbs', async (req, res) => {
  const data = await NCCAOMHerbs.find({});
  res.json(data);
});
router.get('/caleandnccaomformulas', async (req, res) => {
  const data = await CALEAndNCCAOMFormulas.find({});
  res.json(data);
});
router.get('/caleandnccaomherbs', async (req, res) => {
  const data = await CALEAndNCCAOMHerbs.find({});
  res.json(data);
});
router.get('/caleherbs', async (req, res) => {
  const data = await CaleHerbs.find({});
  res.json(data);
});
router.get('/extraherbs', async (req, res) => {
  const data = await ExtraHerbs.find({});
  res.json(data);
});
router.get('/formulacategorylist', async (req, res) => {
  const data = await FormulaCategoryList.find({});
  res.json(data);
});
router.get('/herbcategorylist', async (req, res) => {
  const data = await HerbCategoryList.find({});
  res.json(data);
});
// PATCH: fix endpoint and model for herbGroupsList
router.get('/herbgroupslist', async (req, res) => {
  const data = await HerbGroupsList.find({});
  res.json(data);
});

// "Master" endpoint: combine all main sub-collections into one array
router.get('/tcmpartypalace', async (req, res) => {
  try {
    const formulasNCCAOM = await NCCAOMFormulas.find({});
    const herbsNCCAOM = await NCCAOMHerbs.find({});
    const formulasCALE_NCCAOM = await CALEAndNCCAOMFormulas.find({});
    const herbsCALE_NCCAOM = await CALEAndNCCAOMHerbs.find({});
    const caleHerbs = await CaleHerbs.find({});
    const extraHerbs = await ExtraHerbs.find({});

    const allData = [
      ...formulasNCCAOM,
      ...herbsNCCAOM,
      ...formulasCALE_NCCAOM,
      ...herbsCALE_NCCAOM,
      ...caleHerbs,
      ...extraHerbs
    ];
    res.json(allData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- ADMIN-ONLY WRITE ENDPOINTS BELOW ----------

// PATCH (Update): Update a document by _id in any collection (admin only)
router.patch('/:collection/:id', verifyToken, requireAdmin, async (req, res) => {
  const { collection, id } = req.params;
  const update = req.body;
  const Model = models[collection.toLowerCase()];
  if (!Model) return res.status(400).json({ error: 'Invalid collection name' });

  try {
    const result = await Model.findByIdAndUpdate(id, update, { new: true });
    if (!result) return res.status(404).json({ error: 'Document not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (Create): Add a document to any collection (admin only)
router.post('/:collection', verifyToken, requireAdmin, async (req, res) => {
  const { collection } = req.params;
  const Model = models[collection.toLowerCase()];
  if (!Model) return res.status(400).json({ error: 'Invalid collection name' });

  try {
    const doc = new Model(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a document from any collection by _id (admin only)
router.delete('/:collection/:id', verifyToken, requireAdmin, async (req, res) => {
  const { collection, id } = req.params;
  const Model = models[collection.toLowerCase()];
  if (!Model) return res.status(400).json({ error: 'Invalid collection name' });

  try {
    const result = await Model.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
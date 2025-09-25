const express = require('express');
const router = express.Router();

// Require your MongoDB client/connection
const { getDb } = require('../db'); // assumes a db.js that exports getDb()

/**
 * Helper: get formulas from a given collection, optionally filtered by category or name
 */
async function getFormulas(collectionName, filter = {}) {
  const db = getDb();
  return await db.collection(collectionName).find(filter).toArray();
}

// --- NCCAOM Formulas ---
router.get('/nccaom-formulas', async (req, res) => {
  try {
    // Optional query: ?category=xxx
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.name) filter.name = req.query.name;
    const formulas = await getFormulas('NCCAOMFormulasObject', filter);
    res.json(formulas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CALE + NCCAOM Formulas ---
router.get('/cale-nccaom-formulas', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.name) filter.name = req.query.name;
    const formulas = await getFormulas('caleAndNCCAOMFormulasObject', filter);
    res.json(formulas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Extra Formulas ---
router.get('/extra-formulas', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.name) filter.name = req.query.name;
    const formulas = await getFormulas('extraFormulasObject', filter);
    res.json(formulas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Generic: get formulas by source ---
router.get('/formulas', async (req, res) => {
  try {
    const { source, category, name } = req.query;
    if (!source) return res.status(400).json({ error: 'Missing source parameter' });

    let collectionName;
    if (source === 'nccaom') collectionName = 'NCCAOMFormulasObject';
    else if (source === 'cale+nccaom') collectionName = 'caleAndNCCAOMFormulasObject';
    else if (source === 'extra') collectionName = 'extraFormulasObject';
    else return res.status(400).json({ error: 'Invalid source parameter' });

    const filter = {};
    if (category) filter.category = category;
    if (name) filter.name = name;

    const formulas = await getFormulas(collectionName, filter);
    res.json(formulas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
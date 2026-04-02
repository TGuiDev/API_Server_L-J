const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');

// GET /api/search/products?q=&category=&minPrice=&maxPrice=&promotion=true
router.get('/products', async (req, res) => {
  const { q, category, minPrice, maxPrice, promotion } = req.query;

  const query = { ativo: true };

  if (q && q.toString().trim().length > 0) {
    // usar texto indexado quando possível
    query.$text = { $search: q.toString() };
  }

  if (category) {
    query.categoria = category.toString();
  }

  if (minPrice || maxPrice) {
    query.preco = {};
    if (minPrice) query.preco.$gte = parseFloat(minPrice.toString());
    if (maxPrice) query.preco.$lte = parseFloat(maxPrice.toString());
  }

  // Filtrar por promoção: buscar promoções ativas e construir conjunto de produtos válidos
  if (promotion && (promotion.toString() === 'true' || promotion.toString() === '1')) {
    const promos = await Promotion.find({ active: true });
    const produtoIds = new Set();
    const categoriaIds = new Set();
    for (const p of promos) {
      for (const t of p.targets || []) {
        if (typeof t !== 'string') continue;
        if (t.startsWith('produto:')) produtoIds.add(t.split(':')[1]);
        if (t.startsWith('categoria:')) categoriaIds.add(t.split(':')[1]);
      }
    }

    // Se não temos alvos, retornar vazio
    if (produtoIds.size === 0 && categoriaIds.size === 0) {
      return res.status(200).json({ success: true, total: 0, data: [] });
    }

    query.$or = [];
    if (produtoIds.size > 0) query.$or.push({ _id: { $in: Array.from(produtoIds) } });
    if (categoriaIds.size > 0) query.$or.push({ categoria: { $in: Array.from(categoriaIds) } });
  }

  // Paginação simples
  const page = Math.max(1, parseInt(req.query.page?.toString() ?? '1', 10));
  const limit = Math.min(100, parseInt(req.query.limit?.toString() ?? '50', 10));
  const skip = (page - 1) * limit;

  const docs = await Product.find(query).populate('categoria').skip(skip).limit(limit);
  const total = await Product.countDocuments(query);

  return res.status(200).json({ success: true, total, page, limit, data: docs });
});

module.exports = router;

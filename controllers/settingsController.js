const Banner = require('../models/Banner');
const Promotion = require('../models/Promotion');
const Coupon = require('../models/Coupon');

// BANNERS
exports.listBanners = async (req, res) => {
  const items = await Banner.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

exports.getBanner = async (req, res) => {
  const item = await Banner.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Banner não encontrado' });
  res.json({ success: true, data: item });
};

exports.createBanner = async (req, res) => {
  const body = req.body || {};
  const banner = new Banner({
    title: body.title,
    imagePath: req.file ? req.file.imagePath : body.imagePath,
    actionType: body.actionType,
    actionTarget: body.actionTarget,
    active: body.active !== undefined ? !!body.active : true,
  });

  await banner.save();
  res.status(201).json({ success: true, data: banner });
};

exports.updateBanner = async (req, res) => {
  const body = req.body || {};
  const update = {
    title: body.title,
    actionType: body.actionType,
    actionTarget: body.actionTarget,
  };
  if (req.file && req.file.imagePath) update.imagePath = req.file.imagePath;
  const banner = await Banner.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!banner) return res.status(404).json({ success: false, message: 'Banner não encontrado' });
  res.json({ success: true, data: banner });
};

exports.toggleBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner não encontrado' });
  banner.active = !banner.active;
  await banner.save();
  res.json({ success: true, data: banner });
};

exports.deleteBanner = async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner não encontrado' });
  res.json({ success: true, message: 'Banner removido' });
};

// Public: listar banners ativos (visíveis no site/app)
exports.listActiveBanners = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const q = (req.query.q || '').toString().trim();
    const actionType = req.query.actionType;

    const filter = { active: true };
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (actionType) filter.actionType = actionType;

    const total = await Banner.countDocuments(filter);
    const items = await Banner.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: items,
      meta: { total, page, limit },
    });
  } catch (err) {
    console.error('Erro listActiveBanners:', err);
    res.status(500).json({ success: false, message: 'Erro ao listar banners ativos' });
  }
};
// PROMOTIONS
exports.listPromotions = async (req, res) => {
  const items = await Promotion.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

exports.createPromotion = async (req, res) => {
  const body = req.body || {};
  const promo = new Promotion({
    name: body.name,
    targets: body.targets || [],
    active: body.active !== undefined ? !!body.active : true,
  });
  await promo.save();
  res.status(201).json({ success: true, data: promo });
};

exports.updatePromotion = async (req, res) => {
  const body = req.body || {};
  const promo = await Promotion.findByIdAndUpdate(req.params.id, {
    name: body.name,
    targets: body.targets,
    active: body.active,
  }, { new: true });
  if (!promo) return res.status(404).json({ success: false, message: 'Promoção não encontrada' });
  res.json({ success: true, data: promo });
};

exports.deletePromotion = async (req, res) => {
  const promo = await Promotion.findByIdAndDelete(req.params.id);
  if (!promo) return res.status(404).json({ success: false, message: 'Promoção não encontrada' });
  res.json({ success: true, message: 'Promoção removida' });
};

exports.togglePromotion = async (req, res) => {
  const promo = await Promotion.findById(req.params.id);
  if (!promo) return res.status(404).json({ success: false, message: 'Promoção não encontrada' });
  promo.active = !promo.active;
  await promo.save();
  res.json({ success: true, data: promo });
};

// COUPONS
exports.listCoupons = async (req, res) => {
  const items = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
};

exports.createCoupon = async (req, res) => {
  const body = req.body || {};
  const coupon = new Coupon({
    name: body.name,
    targets: body.targets || [],
    uses: body.uses || 0,
    perUser: body.perUser || 1,
    type: body.type || 'percent',
    value: body.value || 0,
    active: body.active !== undefined ? !!body.active : true,
    requirements: body.requirements,
  });
  await coupon.save();
  res.status(201).json({ success: true, data: coupon });
};

exports.updateCoupon = async (req, res) => {
  const body = req.body || {};
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
    name: body.name,
    targets: body.targets,
    uses: body.uses,
    perUser: body.perUser,
    type: body.type,
    value: body.value,
    active: body.active,
    requirements: body.requirements,
  }, { new: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Cupom não encontrado' });
  res.json({ success: true, data: coupon });
};

exports.deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: 'Cupom não encontrado' });
  res.json({ success: true, message: 'Cupom removido' });
};

exports.toggleCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: 'Cupom não encontrado' });
  coupon.active = !coupon.active;
  await coupon.save();
  res.json({ success: true, data: coupon });
};

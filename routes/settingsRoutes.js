const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');
const { upload, processImagePath } = require('../middleware/uploadMiddleware');

// adminOnly helper
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Apenas administradores podem executar esta ação' });
  }
  next();
};

// BANNERS
// Public endpoint to fetch active banners for display in the app
router.get('/banners/active', settingsController.listActiveBanners);
router.get('/banners', authenticate, adminOnly, settingsController.listBanners);
router.get('/banners/:id', authenticate, adminOnly, settingsController.getBanner);
router.post('/banners', authenticate, adminOnly, upload.single('imagem'), processImagePath, settingsController.createBanner);
router.put('/banners/:id', authenticate, adminOnly, upload.single('imagem'), processImagePath, settingsController.updateBanner);
router.patch('/banners/:id/toggle', authenticate, adminOnly, settingsController.toggleBanner);
router.delete('/banners/:id', authenticate, adminOnly, settingsController.deleteBanner);

// PROMOTIONS
const promoSchema = Joi.object({ name: Joi.string().required(), targets: Joi.array().items(Joi.string()), active: Joi.boolean() });
router.get('/promotions', authenticate, adminOnly, settingsController.listPromotions);
router.post('/promotions', authenticate, adminOnly, settingsController.createPromotion);
router.put('/promotions/:id', authenticate, adminOnly, settingsController.updatePromotion);
router.patch('/promotions/:id/toggle', authenticate, adminOnly, settingsController.togglePromotion);
router.delete('/promotions/:id', authenticate, adminOnly, settingsController.deletePromotion);

// COUPONS
const couponSchema = Joi.object({ name: Joi.string().required(), targets: Joi.array().items(Joi.string()), uses: Joi.number(), perUser: Joi.number(), type: Joi.string().valid('percent','value'), value: Joi.number().required(), active: Joi.boolean(), requirements: Joi.string() });
router.get('/coupons', authenticate, adminOnly, settingsController.listCoupons);
router.post('/coupons', authenticate, adminOnly, settingsController.createCoupon);
router.put('/coupons/:id', authenticate, adminOnly, settingsController.updateCoupon);
router.patch('/coupons/:id/toggle', authenticate, adminOnly, settingsController.toggleCoupon);
router.delete('/coupons/:id', authenticate, adminOnly, settingsController.deleteCoupon);

module.exports = router;

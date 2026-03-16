// Rate Limiting para proteger a API de abuso
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      if (!this.requests.has(ip)) {
        this.requests.set(ip, []);
      }

      const userRequests = this.requests.get(ip);
      const recentRequests = userRequests.filter((time) => now - time < this.windowMs);

      if (recentRequests.length >= this.maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Muitas requisições. Tente novamente mais tarde.',
          retryAfter: Math.ceil(this.windowMs / 1000),
        });
      }

      recentRequests.push(now);
      this.requests.set(ip, recentRequests);

      // Limpar IPs antigos a cada hora
      if (Math.random() < 0.001) {
        for (const [key, times] of this.requests.entries()) {
          const validTimes = times.filter((time) => now - time < this.windowMs);
          if (validTimes.length === 0) {
            this.requests.delete(key);
          } else {
            this.requests.set(key, validTimes);
          }
        }
      }

      next();
    };
  }
}

module.exports = RateLimiter;

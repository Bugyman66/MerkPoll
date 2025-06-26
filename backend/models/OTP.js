const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  emailHash: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

OTPSchema.statics.generateAndSave = async function(emailHash) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await this.deleteMany({ emailHash }); // Remove old OTPs
  await this.create({ emailHash, otp, expiresAt, used: false });
  return otp;
};

OTPSchema.statics.verifyOtp = async function(emailHash, otp) {
  const record = await this.findOne({ emailHash, otp, used: false, expiresAt: { $gt: new Date() } });
  if (!record) return false;
  record.used = true;
  await record.save();
  return true;
};

module.exports = mongoose.model('OTP', OTPSchema);


module.exports = (req, res) => {
  res.status(200).json([
    { wallet: "7yZAbCdEfG1234567890abcdefABCDEF12345678", amount: 987654.321 },
    { wallet: "6xYwVutsRq9876543210fedcbaFEDCBA987654321", amount: 123456.789 }
  ]);
};

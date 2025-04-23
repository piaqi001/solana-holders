
const axios = require('axios');

module.exports = async (req, res) => {
  const tokenAddress = req.query.token;
  if (!tokenAddress) {
    return res.status(400).json({ error: '缺少 token 参数' });
  }

  try {
    const response = await axios.get(
      `https://api.helius.xyz/v1/token-holders?api-key=f9e47385-9354-4ee6-8b39-17cb0326bdc6&mint=${tokenAddress}&limit=200`
    );

    const holders = response.data || [];

    const simplified = holders.map(item => ({
      owner: item.owner,
      amount: item.amount.uiAmount
    }));

    res.status(200).json(simplified);
  } catch (err) {
    console.error("查询失败:", err.message);
    res.status(500).json({ error: "查询失败", detail: err.message });
  }
};


const axios = require('axios');

module.exports = async (req, res) => {
  const tokenAddress = req.query.token;
  if (!tokenAddress) {
    return res.status(400).json({ error: '缺少 token 参数' });
  }

  const apiKey = "f9e47385-9354-4ee6-8b39-17cb0326bdc6";
  const url = `https://api.helius.xyz/v1/token-holders?api-key=${apiKey}&mint=${tokenAddress}&limit=200`;

  try {
    const response = await axios.get(url);
    const holders = response.data;

    if (!Array.isArray(holders)) {
      return res.status(500).json({ error: "返回数据格式不正确", raw: holders });
    }

    const result = holders.map((item, index) => ({
      wallet: item.owner,
      amount: item.amount?.uiAmount ?? 0
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("查询失败:", err.response?.data || err.message);
    res.status(500).json({ error: "查询失败", detail: err.response?.data || err.message });
  }
};

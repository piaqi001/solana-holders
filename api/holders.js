
const axios = require('axios');

module.exports = async (req, res) => {
  const tokenAddress = req.query.token;
  if (!tokenAddress) {
    return res.status(400).json({ error: '缺少 token 参数' });
  }

  const apiKey = "f9e47385-9354-4ee6-8b39-17cb0326bdc6";
  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenLargestAccounts",
      params: [tokenAddress]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const accounts = response.data.result?.value || [];
    const simplified = accounts.map(item => ({
      address: item.address,
      amount: item.uiAmountString
    }));

    res.status(200).json(simplified);
  } catch (err) {
    console.error("查询失败:", err.response?.data || err.message);
    res.status(500).json({ error: "查询失败", detail: err.response?.data || err.message });
  }
};

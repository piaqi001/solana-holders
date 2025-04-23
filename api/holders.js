
const axios = require('axios');

module.exports = async (req, res) => {
  const tokenAddress = req.query.token;
  if (!tokenAddress) {
    return res.status(400).json({ error: '缺少 token 参数' });
  }

  const apiKey = "f9e47385-9354-4ee6-8b39-17cb0326bdc6";
  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  let page = 1;
  let allAccounts = [];

  try {
    while (true) {
      const response = await axios.post(url, {
        jsonrpc: "2.0",
        id: "helius-test",
        method: "getTokenAccounts",
        params: {
          mint: tokenAddress,
          page: page,
          limit: 1000,
          displayOptions: {
            showZeroBalance: false
          }
        }
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const accounts = response.data.result?.token_accounts || [];

      if (accounts.length === 0) {
        break;
      }

      const simplified = accounts.map(item => ({
        owner: item.owner || "unknown",
        amount: item.token_amount?.ui_amount ?? 0
      }));

      allAccounts.push(...simplified);
      page++;
    }

    allAccounts.sort((a, b) => b.amount - a.amount);
    const top200 = allAccounts.slice(0, 200);

    res.status(200).json(top200);
  } catch (err) {
    console.error("查询失败:", err.response?.data || err.message);
    res.status(500).json({ error: "查询失败", detail: err.response?.data || err.message });
  }
};

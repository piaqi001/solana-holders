
const axios = require('axios');

module.exports = async (req, res) => {
  const tokenAddress = req.query.token;
  if (!tokenAddress) {
    return res.status(400).json({ error: '缺少 token 参数' });
  }

  try {
    const response = await axios.post(
      'https://mainnet.helius-rpc.com/?api-key=f9e47385-9354-4ee6-8b39-17cb0326bdc6',
      {
        jsonrpc: "2.0",
        id: "helius-test",
        method: "getTokenAccounts",
        params: {
          mint: tokenAddress,
          page: 1,
          limit: 1000,
          displayOptions: {
            showZeroBalance: false
          }
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    let accounts = response.data.result?.token_accounts || [];
    accounts = accounts.map(item => {
      return {
        owner: item.owner,
        amount: item.token_amount?.ui_amount ?? 0
      };
    });
    accounts.sort((a, b) => b.amount - a.amount);
    const topAccounts = accounts.slice(0, 200);

    res.status(200).json(topAccounts);
  } catch (err) {
    console.error("查询失败:", err.message);
    res.status(500).json({ error: "查询失败", detail: err.message });
  }
};

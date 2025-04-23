
const axios = require('axios');

module.exports = async (req, res) => {
  const tokenMint = req.query.token;
  if (!tokenMint) {
    return res.status(400).json({ error: '缺少 token 参数' });
  }

  const rpcUrl = "https://api.mainnet-beta.solana.com"; // 使用官方 RPC

  try {
    const response = await axios.post(rpcUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "getProgramAccounts",
      params: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
          encoding: "jsonParsed",
          filters: [
            { dataSize: 165 },
            { memcmp: { offset: 0, bytes: tokenMint } }
          ]
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const accounts = response.data.result || [];

    const result = accounts.map(account => {
      const info = account.account?.data?.parsed?.info;
      return {
        wallet: info?.owner || "unknown",
        amount: info?.tokenAmount?.uiAmount ?? 0
      };
    });

    result.sort((a, b) => b.amount - a.amount);
    const top = result.slice(0, 200);

    res.status(200).json(top);
  } catch (err) {
    console.error("查询失败:", err.response?.data || err.message);
    res.status(500).json({ error: "查询失败", detail: err.response?.data || err.message });
  }
};

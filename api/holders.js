
const axios = require('axios');

module.exports = async (req, res) => {
  const ownerAddress = req.query.owner;
  const tokenMint = req.query.token;

  if (!ownerAddress || !tokenMint) {
    return res.status(400).json({ error: '缺少 owner 或 token 参数' });
  }

  const apiKey = "f9e47385-9354-4ee6-8b39-17cb0326bdc6";
  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        ownerAddress,
        { mint: tokenMint },
        { encoding: "jsonParsed" }
      ]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const accounts = response.data.result?.value || [];
    const balances = accounts.map(account => {
      const amount = account.account?.data?.parsed?.info?.tokenAmount?.uiAmountString || "0";
      return {
        account: account.pubkey,
        amount
      };
    });

    res.status(200).json(balances);
  } catch (err) {
    console.error("查询失败:", err.response?.data || err.message);
    res.status(500).json({ error: "查询失败", detail: err.response?.data || err.message });
  }
};

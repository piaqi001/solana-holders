
const axios = require('axios');

module.exports = async (req, res) => {
  const tokenAddress = req.query.token;
  if (!tokenAddress) {
    return res.status(400).json({ error: '缺少 token 参数' });
  }

  const apiKey = "f9e47385-9354-4ee6-8b39-17cb0326bdc6";
  const rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  try {
    // Step 1: 获取最大持仓的 token accounts
    const largestAccountsRes = await axios.post(rpcUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenLargestAccounts",
      params: [tokenAddress]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const tokenAccounts = largestAccountsRes.data.result?.value || [];

    // Step 2: 批量查这些账户的 owner 地址
    const accountAddresses = tokenAccounts.map(a => a.address);
    const infoRes = await axios.post(rpcUrl, {
      jsonrpc: "2.0",
      id: 2,
      method: "getMultipleAccounts",
      params: [
        accountAddresses,
        { encoding: "jsonParsed" }
      ]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const accountInfos = infoRes.data.result?.value || [];

    // Step 3: 返回包含 owner 地址 + 余额
    const result = tokenAccounts.map((acc, i) => {
      const owner = accountInfos[i]?.data?.parsed?.info?.owner || "unknown";
      return {
        wallet: owner,
        tokenAccount: acc.address,
        amount: acc.uiAmountString
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("查询失败:", err.response?.data || err.message);
    res.status(500).json({ error: "查询失败", detail: err.response?.data || err.message });
  }
};

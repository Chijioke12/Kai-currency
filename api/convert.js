// Currency conversion API endpoint
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    var body = req.body;
    var amount = parseFloat(body.amount);
    var from = body.from;
    var to = body.to;
    var rates = body.rates;

    if (!amount || !from || !to || !rates) {
      res.status(400).json({ 
        error: 'Missing required fields: amount, from, to, rates' 
      });
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      res.status(400).json({ 
        error: 'Amount must be a positive number' 
      });
      return;
    }

    if (!rates[from] || !rates[to]) {
      res.status(400).json({ 
        error: 'Currency rates not found for conversion' 
      });
      return;
    }

    // Convert via USD base
    var convertedAmount = (amount / rates[from]) * rates[to];
    var exchangeRate = rates[to] / rates[from];
    
    res.status(200).json({ 
      amount: amount,
      from: from,
      to: to,
      result: parseFloat(convertedAmount.toFixed(2)),
      rate: parseFloat(exchangeRate.toFixed(6)),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Currency conversion failed',
      message: error.message 
    });
  }
}

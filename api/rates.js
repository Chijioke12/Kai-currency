// Currency rates API endpoint
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    var base = req.query.base || 'USD';
    
    // Use a free currency API
    var response = await fetch('https://api.exchangerate-api.com/v4/latest/' + base);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    var data = await response.json();
    
    res.status(200).json({
      base: data.base,
      date: data.date,
      rates: data.rates
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch exchange rates',
      message: error.message 
    });
  }
}

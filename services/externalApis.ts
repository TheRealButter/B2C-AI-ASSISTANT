
/**
 * External Utility APIs (100% Free / Public)
 */

// 1. Postal Code Lookup (Zippopotam.us - ZA Node)
export const lookupPostcode = async (postcode: string) => {
  try {
    const response = await fetch(`https://api.zippopotam.us/za/${postcode}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
};

// 2. Retailer Logo Helper (Clearbit - Free Public)
export const getRetailerLogo = (name: string) => {
  const domainMap: Record<string, string> = {
    'takealot': 'takealot.com',
    'makro': 'makro.co.za',
    'checkers': 'checkers.co.za',
    'pep': 'pepstores.com',
    'woolworths': 'woolworths.co.za',
    'pnp': 'pnp.co.za',
    'game': 'game.co.za',
    'incredible': 'incredible.co.za'
  };
  const key = name.toLowerCase();
  const domain = Object.keys(domainMap).find(d => key.includes(d));
  return domain ? `https://logo.clearbit.com/${domainMap[domain]}` : null;
};

// 3. Tech Trend Intelligence (CoinGecko - Simple Price)
export const getTechTrends = async () => {
  try {
    // We use a proxy of tech-related data to simulate price cycles
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=laptop-computer,apple-ipad,samsung-electronics&vs_currencies=zar&include_24hr_change=true');
    return await response.json();
  } catch (e) {
    return null;
  }
};

// 4. QR Generator (GoQR.me - Public)
export const generateBudgetQR = (data: string) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&bgcolor=000&color=CCFF00`;
};

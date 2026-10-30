const fetchBtn = document.getElementById('fetch-btn');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const cryptoGrid = document.getElementById('crypto-grid');
const errorDiv = document.getElementById('error-message');
let allCoins = [];
function displayCryptos(coins) {
    cryptoGrid.innerHTML = '';
    coins.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${coin.image}" alt="Logo">
            <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
            <p>Price: $${coin.current_price.toLocaleString()}</p>
            <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
        `;
        cryptoGrid.appendChild(card);
    });
}
async function fetchCryptos() {
    errorDiv.textContent = '';
    cryptoGrid.innerHTML = '';
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
        if (!res.ok) throw new Error('Failed to fetch crypto data');
        allCoins = await res.json();
        displayCryptos(allCoins.slice(0, 20));
    } catch (err) {
        errorDiv.textContent = err.message;
    }
}
async function searchCrypto() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    errorDiv.textContent = '';
    cryptoGrid.innerHTML = '';
    try {
        if (allCoins.length === 0) {
            const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
            if (!res.ok) throw new Error('Failed to fetch crypto data');
            allCoins = await res.json();
        }
        const filtered = allCoins.filter(coin => 
            coin.name.toLowerCase().includes(query) || 
            coin.symbol.toLowerCase().includes(query)
        );
        if (filtered.length === 0) {
            throw new Error(`Crypto "${searchInput.value}" not found.`);
        }
        displayCryptos(filtered);
    } catch (err) {
        errorDiv.textContent = err.message;
    }
}
fetchBtn.addEventListener('click', fetchCryptos);
searchBtn.addEventListener('click', searchCrypto);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCrypto();
    }
});
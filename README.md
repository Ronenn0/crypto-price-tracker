# Crypto Price Tracker

A simple web app built with **HTML, CSS, and JavaScript** that lets users check the current price of popular cryptocurrencies.  
It fetches real-time data from the [CoinGecko API](https://www.coingecko.com/en/api) and displays both the **price** and the **coin image**.

---

## 🚀 Features
- Search any cryptocurrency by name.
- Quick select from a dropdown of the **Top 10 popular coins**.
- Displays:
  - Coin name
  - Current price in USD (formatted with commas)
  - Coin image/logo
- **Loading spinner** while fetching data.
- **Local cache** (via `localStorage`) for faster repeat lookups.
- **Last searched coin** is saved and shown automatically when you return.
- **API request cooldown** (prevents spamming the API by disabling the button for 3 seconds).

---

## 🛠️ Technologies Used
- **HTML5** → Structure of the app  
- **CSS3** → Styling with gradients, shadows, and responsive layout  
- **JavaScript (Vanilla)** → API fetch, DOM manipulation, caching, cooldown logic  
- **CoinGecko API** → Real-time cryptocurrency data (price, image, metadata)

---

## 📦 Installation
1. Clone or download this repository.
2. Make sure the following files are in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`
   - `spinner.gif`
3. Open `index.html` in your browser.

---

## 🎮 Usage
1. Type a cryptocurrency name (e.g., `bitcoin`, `ethereum`) into the input field **or** pick one from the dropdown list.
2. Click **"Check Price"**.
3. The card will update with the coin name, current price in USD, and logo.
4. If you reload, the **last coin you checked** will be shown automatically.

---

## 🔮 Future Ideas
- Multi-currency support (EUR, GBP, etc.)
- Show 24h price change with red/green indicator
- Historical charts

---

## 👨‍💻 Developer
Made by **Ronen** using CoinGecko’s free API.  

---

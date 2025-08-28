let serviceDown = false;

let lastChecked;

const cryptoInput = document.querySelector('.cryptocurrency-input');
const checkButton = document.querySelector('.check');

const coinNameElement = document.querySelector('.coin-name');
const coinPriceElement = document.querySelector('.coin-price');
const coinImage = document.querySelector('.coin-image');

const coinSelectElement = document.querySelector('.coin-select');

let cache;

/**
 * gets the price of the inputted coin or displays Error message
 * @param {boolean} coolDown -> should it coolDown after rendering the result or not.
 */
async function checkPrice(coolDown = true) {
    if (serviceDown) return;
    const coinName = cryptoInput.value.toLowerCase();
    if (lastChecked == coinName) return;
    lastChecked = coinName;
    showSpinner();
    try {
        let price = 'Coin not found';
        let imageSrc = '';

        //Check saved cache.
        if (cache[coinName]) {
            price = cache[coinName].price;
            imageSrc = cache[coinName].imageSrc;
            coolDown = false;
        } else {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinName}`);
            const data = await response.json();

            if (data.market_data) {
                price = data.market_data.current_price.usd.toLocaleString() + '$';
                imageSrc = data.image.large;
                cache[coinName] = {
                    price, imageSrc
                };
                saveCache();
            }
        }

        displayData(coinName, price, imageSrc);
    } catch (error) {
        displayData(coinName, 'Something went wrong.', '');
    }
    if (!coolDown) return;
    serviceDown = true;
    setTimeout(() => {
        serviceDown = false;
    }, 3000);
    let counter = 3;
    checkButton.disabled = true;
    while (serviceDown) {
        checkButton.value = counter.toFixed(1);
        counter -= 0.1;
        await sleep(100);
    }
    checkButton.disabled = false;
    checkButton.value = 'Check Price';
}

/**
 * 
 * @param {number} ms -> milliseconds 
 * @returns a promise that needs (ms) milliseconds to be done.
 * the point is to sleep ms milleseconds.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 
 * @param {string} name -> name of the coin
 * @param {string} response -> API response (price) or Error message
 */
function displayData(name, response, imageSrc) {
    cryptoInput.value = name;
    coinNameElement.innerHTML = name;
    coinPriceElement.innerHTML = response;
    coinImage.style.display = imageSrc == '' ? 'none' : 'block';
    coinImage.src = imageSrc;
    const lastCoin = {
        name, response, imageSrc
    };
    //saves last inputted coin
    localStorage.setItem('lastCoin', JSON.stringify(lastCoin));
}

/**
 * Renders Loading spinner
 */
function showSpinner() {
    const spinnerHTML = `<img class="spinner" src="spinner.gif" alt="Loading Spinner">`;
    coinNameElement.innerHTML = spinnerHTML;
    coinPriceElement.innerHTML = '';
    coinImage.src = '';
    coinImage.style.display = 'none';
}

/**
 * Adds all event listeners
 */
function addEvents() {
    checkButton.addEventListener('click', checkPrice);
    coinSelectElement.addEventListener('input', autoCheckCurrency);

    //prevents sending the form
    const coinForm = document.querySelector('.coin-form');
    coinForm.addEventListener('submit', e => e.preventDefault());
}

/**
 * Auto check currency - fired when user picked a currency from the <select> 
 * (popular currencies).
 */
function autoCheckCurrency() {
    if (coolDown) return;
    const currencyName = coinSelectElement.value;
    cryptoInput.value = currencyName;
    checkPrice();
}

/**
 * 
 * loads the saved cache from the localStorage
 */
function loadCache() {
    let savedCache = localStorage.getItem('cache');
    if (savedCache) {
        cache = JSON.parse(savedCache);
        return;
    }
    cache = {};
    saveCache();
}

/**
 * Saves the cache to localStorage
 */
function saveCache() {
    localStorage.setItem('cache', JSON.stringify(cache));
}

/**
 * 
 * @returns the last searched coin - from localStorage
 */
function getLastInputtedCoin() {
    const lastIcon = localStorage.getItem('lastCoin');
    if (lastIcon) {
        return JSON.parse(lastIcon);
    }
}

/**
 * Initializing.
 */
function start() {
    loadCache();
    addEvents();
    const lastIcon = getLastInputtedCoin();
    if (lastIcon) {
        displayData(lastIcon.name, lastIcon.response, lastIcon.imageSrc);
    } else {
        checkPrice(false);
    }
}

//initializes the script.
start();
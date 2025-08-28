let serviceDown = false;

let lastChecked;

const cryptoInput = document.querySelector('.cryptocurrency-input');
const checkButton = document.querySelector('.check');

const coinNameElement = document.querySelector('.coin-name');
const coinPriceElement = document.querySelector('.coin-price');
const coinImage = document.querySelector('.coin-image');

const coinSelectElement = document.querySelector('.coin-select');

/**
 * gets the price of the inputted coin or displays Error message
 */
async function checkPrice(firstTime) {
    if (serviceDown) return;
    const coinName = cryptoInput.value.toLowerCase();
    if (lastChecked == coinName) return;
    lastChecked = coinName;
    showSpinner();
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinName}`);
        const data = await response.json();
        let price = 'Coin not found';
        let imageSrc = '';
        if (data.market_data) {
            price = data.market_data.current_price.usd.toLocaleString() + '$';
            imageSrc = data.image.large;
        }
        displayData(coinName, price, imageSrc);
    } catch (error) {
        displayData(coinName, 'Something went wrong.', '');
    }
    if (firstTime) return;
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 
 * @param {string} name -> name of the coin
 * @param {string} response -> API response (price) or Error message
 */
function displayData(name, response, imageSrc) {
    coinNameElement.innerHTML = name;
    coinPriceElement.innerHTML = response;
    coinImage.style.display = imageSrc == '' ? 'none' : 'block';
    coinImage.src = imageSrc;
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
}

/**
 * Auto check currency - fired when user picked a currency from the <select> 
 * (popular currencies).
 */
function autoCheckCurrency() {
    const currencyName = coinSelectElement.value;
    cryptoInput.value = currencyName;
    checkPrice();
}

function start() {
    addEvents();
    checkPrice(true);
}

start();
const quoteText = document.getElementById("quote");
const quoteContainer = document.getElementById("quote-container");
const quoteAuthor = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

const showLoadingSpinner = () => {
    loader.hidden = false;
    quoteContainer.hidden = true;
};

const removeLoadingSpinner = () => {
    if (loader.hidden === false) {
        loader.hidden = true;
        quoteContainer.hidden = false;
    }
};

const errorScreen = () => {
    quoteText.innerText = "Error, please try again";
    quoteAuthor.hidden = true;
};

reloadCounter = 0;

// Get quotes from API
async function getQuote() {
    //proxy to prevent CORS error
    showLoadingSpinner();
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const apiUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
    try {
        response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        data = await response.json();

        //get the contents because of proxy API
        dataJSON = JSON.parse(data.contents);

        //if the author name is unavailable
        if (dataJSON.quoteAuthor === "") {
            quoteAuthor.innerText = "Unknown";
        } else {
            quoteAuthor.innerText = dataJSON.quoteAuthor;
        }

        //Reduce size for longer text
        if (dataJSON.quoteText.length > 50) {
            quoteText.classList.add("long-quote");
        } else {
            quoteText.classList.remove("long-quote");
        }
        quoteText.innerText = dataJSON.quoteText;

        removeLoadingSpinner();
    } catch (e) {
        console.log(e);
        if (reloadCounter++ < 10) {
            return getQuote();
        } else {
            errorScreen();
        }
    }
}

const tweetQuote = () => {
    const quote = dataJSON.quoteText;
    const author = dataJSON.quoteAuthor;
    const twitterUrl = `https://twitter.com/intent/tweet?text="${quote}" - ${author}`;
    window.open(twitterUrl, "_blank");
};

//Event listener
newQuoteBtn.addEventListener("click", () => {
    getQuote();
    reloadCounter = 0;
});
twitterBtn.addEventListener("click", tweetQuote);

//onLoad
getQuote();

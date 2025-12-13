const QUOTES_API = "https://api.api-ninjas.com/v2/randomquotes";
const API_KEY = "oqs36QGq77pG0gWpe7kPEQ==xt2briaYzow8qNKu";

const theQuote = document.getElementById('theQuote');
let lastQuote = "";
const localQuotes = [
    "Be yourself; everyone else is already taken. — Oscar Wilde",
    "Life is what happens when you're busy making other plans. — John Lennon",
    "Do what you can, with what you have, where you are. — Theodore Roosevelt",
    "The only limit to our realization of tomorrow is our doubts of today. — Franklin D. Roosevelt",
    "The best way to get started is to quit talking and begin doing. — Walt Disney",
    "Your time is limited, so don't waste it living someone else's life. — Steve Jobs",
    "If life were predictable it would cease to be life, and be without flavor. — Eleanor Roosevelt",
    "If you look at what you have in life, you'll always have more. — Oprah Winfrey",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. — Winston Churchill",
    "It does not matter how slowly you go as long as you do not stop. — Confucius"
];

function clearList() {
    theQuote.innerHTML = "";
}

// Add a quote with optional remove button
function addQuoteToList(text, removable = false) {
    const li = document.createElement("li");
    li.textContent = text;

    if (removable) {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "D";
        removeBtn.style.fontSize = "0.8em";
        removeBtn.style.backgroundColor = "inherit";
        removeBtn.style.color = "darkgray";
        removeBtn.style.border = "none";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.fontFamily = "tahoma";
        removeBtn.style.display = "block";
        removeBtn.style.margin = "0 auto";

        removeBtn.onclick = () => {
            li.remove(); // remove from DOM
            let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
            savedQuotes = savedQuotes.filter(q => q !== text);
            localStorage.setItem("quotes", JSON.stringify(savedQuotes));
        };

        li.appendChild(removeBtn);
    }

    theQuote.appendChild(li);
}

// Fetch quote from API or fallback
async function fetchQuote() {
    clearList();
    addQuoteToList("Loading...");

    const TIMEOUT = 900;

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), TIMEOUT);
    });

    const fetchPromise = fetch(QUOTES_API, {
        headers: { "X-Api-Key": API_KEY }
    })
    .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
    });

    Promise.race([fetchPromise, timeoutPromise])
        .then(data => {
            const quote = data[0].quote;
            const author = data[0].author;

            lastQuote = `${quote} — ${author}`;
            clearList();
            addQuoteToList(lastQuote);
        })
        .catch(() => {
            const randomIndex = Math.floor(Math.random() * localQuotes.length);
            lastQuote = localQuotes[randomIndex];
            clearList();
            addQuoteToList(lastQuote);
        });
}

// Save current quote
function saveQuote() {
    let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    if (!lastQuote) {
        clearList();
        addQuoteToList("No quote to save!");
        return;
    }

    if (savedQuotes.includes(lastQuote)) {
        clearList();
        addQuoteToList(lastQuote);
        addQuoteToList("✅ Quote already saved!");
        return;
    }

    savedQuotes.push(lastQuote);
    localStorage.setItem("quotes", JSON.stringify(savedQuotes));

    clearList();
    addQuoteToList(lastQuote);
    addQuoteToList("✅ Quote saved!");
}

// Show favorite quotes with remove buttons
function showFavQuotes() {
    let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    clearList();

    if (savedQuotes.length === 0) {
        addQuoteToList("No saved quotes yet!");
        return;
    }

    savedQuotes.reverse().forEach(q => addQuoteToList(q, true)); // true = removable
}

// Clear all saved quotes
function clearStorage() {
    localStorage.removeItem("quotes");
    clearList();
    addQuoteToList("All saved quotes have been cleared!");
}

// Run showFavQuotes on page load
window.onload = function() {
    showFavQuotes();
};

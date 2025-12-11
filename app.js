const theQuote = document.getElementById('theQuote');
let lastQuote = "";
const localQuotes = [
    "Be yourself; everyone else is already taken. — Oscar Wilde",
    "Life is what happens when you're busy making other plans. — John Lennon",
    "Do what you can, with what you have, where you are. — Theodore Roosevelt",
    "The only limit to our realization of tomorrow is our doubts of today. — Franklin D. Roosevelt",
    "The best way to get started is to quit talking and begin doing. — Walt Disney",
    "Your time is limited, so don’t waste it living someone else’s life. — Steve Jobs",
    "If life were predictable it would cease to be life, and be without flavor. — Eleanor Roosevelt",
    "If you look at what you have in life, you'll always have more. — Oprah Winfrey",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. — Winston Churchill",
    "It does not matter how slowly you go as long as you do not stop. — Confucius"
];

function clearList() {
    theQuote.innerHTML = "";
}

function addQuoteToList(text) {
    const li = document.createElement("li");
    li.textContent = text;
    theQuote.appendChild(li);
}

function fetchQuote() {
    clearList();
    addQuoteToList("Loading...");

    const TIMEOUT = 900;
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), TIMEOUT);
    });

    const fetchPromise = fetch("https://api.quotable.io/random")
        .then(res => {
            if (!res.ok) throw new Error("Network response not ok");
            return res.json();
        });

    Promise.race([fetchPromise, timeoutPromise])
        .then(data => {
            lastQuote = `${data.content} — ${data.author}`;
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

function saveQuote() {
    let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    if (!lastQuote) {
        clearList();
        addQuoteToList("No quote to save!");
        return;
    }

    if (savedQuotes.includes(lastQuote)) {
        clearList();
        addQuoteToList(lastQuote);                   // Quote on its own line
        addQuoteToList("✅ Quote already saved!");    // Message on a separate line
        return;
    }

    savedQuotes.push(lastQuote);
    localStorage.setItem("quotes", JSON.stringify(savedQuotes));

    clearList();
    addQuoteToList(lastQuote);                       // Quote on its own line
    addQuoteToList("✅ Quote saved!");               // Message on a separate line
}


function showFavQuotes() {
    let savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    clearList();

    if (savedQuotes.length === 0) {
        addQuoteToList("No saved quotes yet!");
        return;
    }

    savedQuotes.reverse().forEach(q => addQuoteToList(q));
}

function clearStorage() {
    localStorage.removeItem("quotes");
    clearList();
    addQuoteToList("All saved quotes have been cleared!");
}

// Run showFavQuotes when the page finishes loading
window.onload = function() {
    showFavQuotes();
};

@media only screen and (max-width: 768px) {
    body {
        background-color: lightblue;
    }
    .data-lang {
        padding: 0 10px;
    }
}

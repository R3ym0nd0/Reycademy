const videoBar = document.querySelectorAll(".video-bar"); // All category filter buttons
const videoCards = document.querySelectorAll(".video-card"); // All video cards
const searchBar = document.querySelector("#search-bar"); // The input element for searching
const suggestionBox = document.querySelector("#suggestions"); // Suggestion dropdown container
const searchItems = document.querySelectorAll("#suggestions ul li"); // All <li> items (search suggestions)
const noResult = document.querySelector("#no-result"); // The "No result" message in suggestions

// === FILTER suggestions based on user input ===
searchBar.addEventListener("input", () => {
    const keyword = searchBar.value.toLowerCase(); // Get lowercase input value
    let hasMatch = false;

    // If input is empty, show only main categories, hide episodes
    if (keyword === "") {
        searchItems.forEach((li) => {
            if (li.classList.contains("episodes")) {
                // Hide episode suggestions
                li.style.display = "none"; 
            } else {
                // Show main category suggestions
                li.style.display = "block"; 
            }
        });
        // Hide "no result" text
        noResult.style.display = "none"; 
        return;
    }

    // Filter suggestion list based on user input
    searchItems.forEach((li) => {
        const textMatch = li.textContent.toLowerCase().includes(keyword);
        li.style.display = textMatch ? "block" : "none"; // Show/hide based on match
        if (textMatch) hasMatch = true; // Mark if at least one match is found
    });

    // Show or hide the "no result" message
    noResult.style.display = hasMatch ? "none" : "block";
    suggestionBox.classList.add("show"); // Always show suggestion box while typing
});

// === Pressing ENTER will select the FIRST matched suggestion ===
searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const keyword = searchBar.value.toLowerCase();

        // Find first suggestion that includes the keyword
        const match = Array.from(searchItems).find((li) => li.textContent.toLowerCase().includes(keyword));

        // If match found, simulate a click on that suggestion
        if (match) match.click();
    }
});

// === Show suggestion box when clicking the search bar ===
searchBar.addEventListener("click", () => {
    suggestionBox.classList.add("show");
});

// === Hide suggestion box when search bar loses focus ===
searchBar.addEventListener("blur", () => {
    setTimeout(() => {
        suggestionBox.classList.remove("show");
    }, 150);
});

// === When a suggestion is clicked, filter the video cards ===
searchItems.forEach((item) => {
    item.addEventListener("click", () => {
        const { category, ep } = item.dataset; // Get the category and episode from data attributes

        // Scroll to the videos section
        const section = document.getElementById('videos');
        if (section) section.scrollIntoView({ behavior: 'smooth' });

        // Remove "active" class from all category buttons
        videoBar.forEach((btn) => btn.classList.remove("active"));

        // Loop through all video cards and filter
        videoCards.forEach((card) => {
            const matchCategory = category === "all" || card.dataset.category === category;
            const matchEpisode = ep === "all" || card.dataset.ep === ep;

            // Show only matched cards
            card.style.display = matchCategory && matchEpisode ? "block" : "none";
        });
    });
});

// === When a category button is clicked, filter by category only ===
videoBar.forEach((btn) => {
    btn.addEventListener("click", () => {
        const { category } = btn.dataset;

        // Remove "active" class from all buttons and set active one
        videoBar.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Filter video cards based on category
        videoCards.forEach((card) => {
            card.style.display = category === "all" || card.dataset.category === category ? "block" : "none";
        });
    });
});

// Temporary - Alert "Coming Soon" for cheatsheet links
document.querySelectorAll(".cheatsheet a").forEach(link => {
    link.addEventListener("click", () => {
        alert("Coming Soon");
    })
});
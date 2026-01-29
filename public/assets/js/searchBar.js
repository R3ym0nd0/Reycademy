const videoBar = document.querySelectorAll(".video-bar"); 
const searchBar = document.querySelector("#search-bar");
const suggestionBox = document.querySelector("#suggestions");
const videoList = document.querySelector("#video-list");

searchBar.addEventListener("focus", () => {

    if (suggestionBox.querySelector('ul').children.length > 0) {
        suggestionBox.classList.add("show");
    }
    
});

searchBar.addEventListener("blur", () => {

    suggestionBox.classList.remove("show");

});

searchBar.addEventListener("input", async () => {
    const keyword = searchBar.value.trim();
    const ul = suggestionBox.querySelector('ul');
    ul.innerHTML = '';

    if (!keyword) {
        suggestionBox.classList.remove("show");
        return;
    }

    try {
        const res = await fetch(`https://reycademy.onrender.com/search?query=${encodeURIComponent(keyword)}`);
        const results = await res.json();

        if (!Array.isArray(results) || results.length === 0) {
            ul.innerHTML = `<li id="no-result">No match found</li>`;
        } else {
            results.forEach(video => {
                const li = document.createElement('li');
                li.textContent = video.title;
                li.dataset.category = video.category;
                li.dataset.ep = video.episode;
                li.addEventListener('mousedown', () => {
                    videoBar.forEach(b => b.classList.remove("active"));
                    renderVideos([video]);
                    suggestionBox.classList.remove("show");
                });

                ul.appendChild(li);
            });
        }

        suggestionBox.classList.add("show");
    } catch (err) {
        console.error(err);
        ul.innerHTML = `<li id="no-result">Error fetching results</li>`;
        suggestionBox.classList.add("show");
    }
});

searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();

        videoBar.forEach(b => b.classList.remove("active"));

        const firstItem = suggestionBox.querySelector("ul li:not(#no-result)");
        if (!firstItem) return;

        firstItem.dispatchEvent(new MouseEvent("mousedown"));
    }
});

function renderVideos(videos) {
    videoList.innerHTML = "";

    if (!Array.isArray(videos) || videos.length === 0) {
        videoList.innerHTML = `<p>No videos found</p>`;
        return;
    }

    videos.forEach(video => {
        const card = document.createElement("div");
        card.classList.add("video-card");
        card.dataset.category = video.category;
        card.dataset.ep = video.episode || "all";

        card.innerHTML = `
            <iframe width="560" height="315" src="${video.url}" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
            <h3>${video.title}</h3>
            <p>Coming Soon</p>
            <div class="button-container">
                <a href="#" class="video-button">Quiz</a>
                <a href="#" class="video-button">Hands on</a>
            </div>
            <div class="cheatsheet"><a>Cheatsheet</a></div>
            <div class="video-meta">
                <img src="assets/images/me.PNG" alt="Profile picture of Reymond" class="author-pic">
                <p class="author">By <a href="https://www.linkedin.com/in/reymond-joaquin-3b5954308" target="_blank" class="teacher">Reymond Joaquin</a> | 2025</p>
            </div>
        `;
        videoList.appendChild(card);
    });
}

videoBar.forEach(btn => {
    btn.addEventListener("click", async () => {
        const category = btn.dataset.category;

        videoBar.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        try {
            const res = await fetch(`https://reycademy.onrender.com/search?query=&category=${encodeURIComponent(category)}`);
            const results = await res.json();
            renderVideos(results);
        } catch (err) { 
            console.error(err);
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("https://reycademy.onrender.com/search?category=all");
        const results = await res.json();
        renderVideos(results);
    } catch (err) {
        console.error(err);
    }
});
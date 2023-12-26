const pagesData = [
    {
        id: 1,
        title: "Ice Page",
        description: "A page with a frozen landscape.",
        image: "https://placekitten.com/300/200",
        ending: "Thanks for visiting the Ice Page!",
        author: "Elsa",
        category: "Ice Pages"
    },
    {
        id: 2,
        title: "Desert Page",
        description: "A page with endless dunes and a magic carpet.",
        image: "https://placekitten.com/300/201",
        ending: "Hope you enjoyed the Desert Page!",
        author: "Aladdin",
        category: "Desert Pages"
    },
    {
        id: 3,
        title: "Fire Page",
        description: "A page with flames and mythical creatures.",
        image: "https://placekitten.com/300/202",
        ending: "That's the end of the Fire Page!",
        author: "Hades",
        category: "Fire Pages"
    },
    {
        id: 4,
        title: "Mystery Page",
        description: "A mysterious page with hidden clues.",
        image: "https://placekitten.com/300/203",
        ending: "The mystery unfolds in this page!",
        author: "Sherlock Holmes",
        category: "Mystery Pages"
    }
    // Add more pages as needed
];



const authorsData = [];

const uniqueAuthors = [...new Set(pagesData.map(page => page.author))];
uniqueAuthors.forEach(author => {
    const authorPages = pagesData.filter(page => page.author === author).map(page => page.id);
    authorsData.push({ name: author, pages: authorPages });
});

function createPageElement(page) {
    const pageElement = document.createElement("div");
    pageElement.classList.add("page");
    pageElement.id = `page-${page.id}`;
    pageElement.innerHTML = `
<h2 class="page-title">${page.title}</h2>
<p>${page.description}</p>
<img src="${page.image}" alt="${page.title}">
<div class="page-ending">${page.ending}</div>
<div class="author">${page.author}</div>
`;
    document.getElementById("pages-container").appendChild(pageElement);
}

pagesData.forEach(createPageElement);

function showPageFromHash() {
    const hash = window.location.hash.slice(1);
    const pageId = hash.replace("page", "");
    showPage(pageId || "page-list");
}

window.addEventListener("load", showPageFromHash);
window.addEventListener("hashchange", showPageFromHash);

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    const selectedPage = document.getElementById(`page-${pageId}`);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    const pageList = document.getElementById('page-list');
    pageList.style.display = (pageId === 'page-list') ? 'block' : 'none';

    const searchResults = document.getElementById('search-results');
    searchResults.style.display = (pageId === 'search') ? 'block' : 'none';

    const searchBarContainer = document.getElementById('search-bar-container');
    searchBarContainer.style.display = (pageId === 'search') ? 'block' : 'none';

    const searchNote = document.getElementById('search-note');
    searchNote.style.display = (pageId === 'search') ? 'block' : 'none';

    updatePageListLinks();
    updateSearchResultsLinks();
}

function filterPages() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    updateSearchResultsLinks(searchInput);
}

function updatePageListLinks() {
    const pageLinksList = document.getElementById('page-links-list');
    pageLinksList.innerHTML = '';

    const categorizedPages = categorizePages(pagesData);

    for (const category in categorizedPages) {
        const categoryListItem = document.createElement('li');
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        categoryListItem.appendChild(categoryHeader);

        const categoryList = document.createElement('ul');

        categorizedPages[category].forEach(page => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${page.id}`;
            link.innerHTML = `<span class="page-title">${page.title}</span> <span class="author" onclick="showAuthorPages('${page.author}')">(${page.author})</span>`;
            listItem.appendChild(link);
            categoryList.appendChild(listItem);
        });

        categoryListItem.appendChild(categoryList);
        pageLinksList.appendChild(categoryListItem);
    }
}

function updateSearchResultsLinks(searchInput) {
    const searchResultsList = document.getElementById('search-results-list');
    searchResultsList.innerHTML = '';

    pagesData.forEach(page => {
        const title = page.title.toLowerCase();
        const description = page.description.toLowerCase();
        const ending = page.ending.toLowerCase();
        const author = page.author.toLowerCase();

        if (title.includes(searchInput) || description.includes(searchInput) || ending.includes(searchInput) || author.includes(searchInput)) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#page${page.id}`;
            link.innerHTML = `<span class="page-title">${page.title}</span> <span class="author">${page.author}</span>`;
            listItem.appendChild(link);
            searchResultsList.appendChild(listItem);
        }
    });
}

function categorizePages(pages) {
    const categorizedPages = {};

    pages.forEach(page => {
        if (!categorizedPages[page.category]) {
            categorizedPages[page.category] = [];
        }

        categorizedPages[page.category].push(page);
    });

    return categorizedPages;
}

document.addEventListener("click", function (event) {
    const target = event.target;
    const authorElement = target.closest(".author");

    if (authorElement) {
        event.preventDefault();

        const authorName = authorElement.textContent.trim();
        const cleanedAuthorName = authorName.replace(/\W/g, ''); // Remove non-word characters
        window.location.href = `creatorPage.html#${cleanedAuthorName}`;
    }
});
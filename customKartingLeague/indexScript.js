const pagesData = [
    {
        id: 1,
        title: "Karting School",
        description: "track learn or something xd",
        image: "https://placekitten.com/300/200",
        ending: "Karting School!",
        author: ["ForgotWhoMadeThis"],
        category: "Official Tracks"
    },
    {
        id: 2,
        title: "ThingEEEEEE",
        description: "A mysterious track with hidden clues.",
        image: "https://placekitten.com/300/203",
        ending: "Why are there clues in a track???!",
        author: ["gruProbably"],
        category: "Custom Tracks"
    },
    {
        id: 3,
        title: "Karting School2",
        description: "track learn or something xd",
        image: "https://placekitten.com/300/200",
        ending: "Karting School2!",
        author: ["ForgotWhoMadeThis", "helloItsMe"],
        category: "Official Tracks"
    },
    {
        id: 4,
        title: "Karting School3",
        description: "track learn or something xd",
        image: "https://placekitten.com/300/200",
        ending: "Karting School3!",
        author: ["helloItsMe"],
        category: "Official Tracks"
    },
];

const authorsData2 = [
    {
        nameID: "ForgotWhoMadeThis",
        bio: "Queen of ArebusLand, known for her ice powers.",
        image: "https://placekitten.com/300/200"
    },
    {
        nameID: "helloItsMe",
        bio: "Street-smart young man with a magic carpet.",
        image: "https://placekitten.com/300/201"
    },
    {
        nameID: "gruProbably",
        bio: "Ruler of the Underworld with a fiery personality.",
        image: "https://placekitten.com/300/202"
    },
];


const authorsData = [];

const uniqueAuthors = [...new Set(pagesData.flatMap(page => page.author))];
uniqueAuthors.forEach(authorName => {
    const authorPages = pagesData.filter(page => page.author.includes(authorName)).map(page => page.id);
    
    const authorInfo = authorsData2.find(author => author.nameID === authorName);
    const authorObject = {
        name: authorName,
        pages: authorPages,
        bio: authorInfo ? authorInfo.bio : "No bio available",
        image: authorInfo ? authorInfo.image : "https://placekitten.com/300/200" // Default image if not found
    };

    authorsData.push(authorObject);
});

// Get the current file path
var currentFilePath = document.location.pathname;

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

    console.log(pageElement)

    // Check if the script is running in "file1.html"
    if (currentFilePath.includes("index.html")) {
        console.log("Script is running in file1.html");
        document.getElementById("pages-container").appendChild(pageElement);
    }
}

pagesData.forEach(createPageElement);

function showPageFromHash() {
    const hash = window.location.hash.slice(1);
    const pageId = hash.replace("page", "");

    const isAuthorPage = uniqueAuthors.includes(pageId);

    // Set the initial value of the search bar to the author's name if it's an author page
    const searchInput = document.getElementById('search-bar');

    if (isAuthorPage) {
        // Add '@' symbol before the author's name
        searchInput.value = `@${pageId}`;
    } else if (pageId.startsWith('#')) {
        // Add '#' symbol before the track name
        searchInput.value = `#${pageId.substring(1)}`;
    } else {
        // Regular search or page-list
        searchInput.value = "";
    }

    // Trigger the filtering with the initial value after a short delay
    setTimeout(function () {
        filterPages();
    }, 100);

    // Show the corresponding page based on the hash
    showPage(pageId || "page-list");
}




window.addEventListener("load", showPageFromHash);
window.addEventListener("hashchange", showPageFromHash);

const currentPath = window.location.href;

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    const selectedPage = document.getElementById(`page-${pageId}`);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    const isAuthorPage = uniqueAuthors.includes(pageId);


    if (currentFilePath.includes("index.html") || currentFilePath.includes("customkartingleague/") || currentFilePath.includes("customKartingLeague/")) {
        const pageList = document.getElementById('page-list');
        pageList.style.display = (pageId === 'page-list') ? 'block' : 'none';

        const searchNote = document.getElementById('search-note');
        searchNote.style.display = (pageId === 'search') ? 'block' : 'none';

        const infoPage = document.getElementById('info');
        infoPage.style.display = (pageId === 'info') ? 'block' : 'none';
    }

    const searchResults = document.getElementById('search-results');
    searchResults.style.display = (pageId === 'search' || isAuthorPage) ? 'block' : 'none';

    const searchBarContainer = document.getElementById('search-bar-container');
    searchBarContainer.style.display = (pageId === 'search') ? 'block' : 'none';



    updatePageListLinks();
    updateSearchResultsLinks();
}

function filterPages() {
    const searchInput = document.getElementById('search-bar').value.trim().toLowerCase();

    // Check if the search term starts with '@' or '#'
    if (searchInput.startsWith('@')) {
        const authorToSearch = searchInput.substring(1); // Remove the '@' symbol
        updateSearchResultsLinksByAuthor(authorToSearch);
    } else if (searchInput.startsWith('#')) {
        const trackNameToSearch = searchInput.substring(1); // Remove the '#' symbol
        updateSearchResultsLinksByTrack(trackNameToSearch);
    } else {
        // Regular search
        updateSearchResultsLinks(searchInput);
    }
}

function authorLinkCreation(page, listItem) {
    page.author.forEach(function (authorElement) {
        const authorLink = document.createElement('a');
        authorLink.href = `./creatorPage.html#${authorElement.replace(/\W/g, '')}`;
        authorLink.innerHTML = `<span class="author">${authorElement}</span>`;

        listItem.appendChild(authorLink);
        listItem.appendChild(document.createTextNode('-----'));
    });

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
            const titleLink = document.createElement('a');

            // Set href attributes directly for title and author links
            titleLink.href = `#${page.id}`;

            // Set HTML content for title and author links
            titleLink.innerHTML = `<span class="page-title">${page.title}</span>`;

            // Append title and author links to the list item
            listItem.appendChild(titleLink);
            authorLinkCreation(page, listItem)

            // Append the list item to the category list
            categoryList.appendChild(listItem);
        });

        categoryListItem.appendChild(categoryList);
        pageLinksList.appendChild(categoryListItem);
    }
}

function updateSearchResultsLinks(searchInput) {
    const searchResultsList = document.getElementById('search-results-list');
    searchResultsList.innerHTML = '';

    // Always display the full list when there's no search input
    if (!searchInput || searchInput.trim() === '') {
        pagesData.forEach(page => {
            const listItem = document.createElement('li');

            // Create separate links for page title and author
            const titleLink = document.createElement('a');


            titleLink.href = `./index.html#${page.id}`;

            titleLink.innerHTML = `<span class="page-title">${page.title}</span>`;

            // Append title and author links to the list item
            listItem.appendChild(titleLink);
            authorLinkCreation(page, listItem)

            // Append the list item to the search results list
            searchResultsList.appendChild(listItem);
        });
    } else {
        // Filter and display results based on search input
        const filteredPages = pagesData.filter(page => {
            const title = page.title.toLowerCase();
            const description = page.description.toLowerCase();
            const ending = page.ending.toLowerCase();
            const author = page.author.toLowerCase();

            return (
                title.includes(searchInput) ||
                description.includes(searchInput) ||
                ending.includes(searchInput) ||
                author.includes(searchInput)
            );
        });

        if (filteredPages.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.textContent = 'No results found.';
            searchResultsList.appendChild(noResultsItem);
        } else {
            filteredPages.forEach(page => {
                const listItem = document.createElement('li');

                // Create separate links for page title and author
                const titleLink = document.createElement('a');

                titleLink.href = `./index.html#${page.id}`;

                titleLink.innerHTML = `<span class="page-title">${page.title}</span>`;

                // Append title and author links to the list item
                listItem.appendChild(titleLink);
                authorLinkCreation(page, listItem)

                // Append the list item to the search results list
                searchResultsList.appendChild(listItem);
            });
        }
    }
}

function updateSearchResultsLinksByAuthor(authorToSearch) {
    const searchResultsList = document.getElementById('search-results-list');
    searchResultsList.innerHTML = '';

    let filteredPages = pagesData.filter(page => {
        return page.author.some(authorElement => {
            const authorName = authorElement.toLowerCase();
            return authorName.includes(authorToSearch);
        });
    });

    // Sort the filtered pages by the concatenated author names
    filteredPages.sort((a, b) => {
        const authorsA = a.author.join(', ').toLowerCase();
        const authorsB = b.author.join(', ').toLowerCase();
        return authorsA.localeCompare(authorsB);
    });

    if (filteredPages.length === 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'No results found.';
        searchResultsList.appendChild(noResultsItem);
    } else {
        filteredPages.forEach(page => {
            const listItem = document.createElement('li');

            // Create separate links for author and title
            const titleLink = document.createElement('a');

            titleLink.href = `./index.html#${page.id}`;

            titleLink.innerHTML = `<span class="page-title">${page.title}</span>`;

            // Append author and title links to the list item
            authorLinkCreation(page, listItem);
            listItem.appendChild(titleLink);

            // Append the list item to the search results list
            searchResultsList.appendChild(listItem);
        });
    }
}



function updateSearchResultsLinksByTrack(trackNameToSearch) {
    const searchResultsList = document.getElementById('search-results-list');
    searchResultsList.innerHTML = '';

    let filteredPages = pagesData.filter(page => {
        const trackName = page.title.toLowerCase();
        return trackName.includes(trackNameToSearch);
    });

    // Sort the filtered pages by track name
    filteredPages.sort((a, b) => a.title.localeCompare(b.title));

    if (filteredPages.length === 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'No results found.';
        searchResultsList.appendChild(noResultsItem);
    } else {
        filteredPages.forEach(page => {
            const listItem = document.createElement('li');

            // Create separate links for author and title
            const titleLink = document.createElement('a');

            titleLink.href = `./index.html#${page.id}`;

            titleLink.innerHTML = `<span class="page-title">${page.title}</span>`;

            // Append author and title links to the list item
            listItem.appendChild(titleLink);
            authorLinkCreation(page, listItem);

            // Append the list item to the search results list
            searchResultsList.appendChild(listItem);
        });
    }
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
        setTimeout(reloadPage, 100);
    }
});

function reloadPage() {
    location.reload(true);
}


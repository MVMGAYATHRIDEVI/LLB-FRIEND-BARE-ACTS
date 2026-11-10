
// ========================================
// LLB FRIEND - BARE ACTS LIBRARY
// ========================================

const resources = [
    {
        title: "Bharatiya Nagarik Suraksha Sanhita, 2023",
        file: "Bharatiya Nagarik Suraksha Sanhita 2023.pdf",
        category: "Criminal Law"
    },
    {
        title: "Bharatiya Nyaya Sanhita, 2023",
        file: "Bharatiya Nyaya Sanhita 2023.pdf",
        category: "Criminal Law"
    },
    {
        title: "Constitution of India - Bare Act",
        file: "Constitution of India - Bare Act.pdf",
        category: "Constitutional Law"
    },
    {
        title: "Consumer Protection Act, 2019",
        file: "Consumer Protection Act 2019.pdf",
        category: "Other Laws"
    },
    {
        title: "Indian Contract Act - Bare Act",
        file: "Indian Contract Act - Bare Act.pdf",
        category: "Commercial Law"
    },
    {
        title: "Indian Succession Act, 1925 - Bare Act",
        file: "Indian Succession Act 1925 - Bare Act.pdf",
        category: "Civil Law"
    },
    {
        title: "The Bharatiya Sakshya Adhiniyam, 2023",
        file: "The Bharatiya Sakshya Adhiniyam 2023.pdf",
        category: "Criminal Law"
    },
    {
        title: "The Digital Personal Data Protection Act, 2023",
        file: "The Digital Personal Data Protection Act, 2023.pdf",
        category: "Other Laws"
    }
];

// ========================================
// HTML ELEMENTS
// ========================================

const resourceList = document.getElementById("resourceList");
const searchInput = document.getElementById("searchInput");
const resourceCount = document.getElementById("resourceCount");
const emptyMessage = document.getElementById("emptyMessage");
const statusMessage = document.getElementById("statusMessage");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearSearch = document.getElementById("clearSearch");

// ========================================
// VARIABLES
// ========================================

let availableResources = [];
let selectedCategory = "All";
let searchText = "";

// ========================================
// CHECK WHETHER PDF EXISTS
// ========================================

async function checkPDF(resource) {
    const pdfURL = "PDFs/" + encodeURIComponent(resource.file);

    try {
        const response = await fetch(pdfURL, {
            method: "HEAD",
            cache: "no-store"
        });

        if (
            response.ok &&
            response.headers.get("content-type")?.includes("application/pdf")
        ) {
            return {
                ...resource,
                url: pdfURL
            };
        }

        return null;

    } catch (error) {
        console.error("PDF checking error:", resource.file, error);
        return null;
    }
}

// ========================================
// LOAD AVAILABLE PDF FILES
// ========================================

async function loadResources() {
    statusMessage.hidden = false;
    statusMessage.textContent = "Checking available Bare Acts...";

    const results = await Promise.all(
        resources.map(resource => checkPDF(resource))
    );

    availableResources = results.filter(resource => resource !== null);

    resourceCount.textContent = availableResources.length;

    if (availableResources.length === 0) {
        statusMessage.textContent =
            "No PDF records found. Please check your PDFs folder and filenames.";

        renderResources();
        return;
    }

    statusMessage.textContent =
        `Successfully found ${availableResources.length} out of ${resources.length} Bare Acts.`;

    renderResources();
}

// ========================================
// DISPLAY RESOURCE CARDS
// ========================================

function renderResources() {
    resourceList.innerHTML = "";

    const filteredResources = availableResources.filter(resource => {
        const matchesCategory =
            selectedCategory === "All" ||
            resource.category === selectedCategory;

        const matchesSearch =
            resource.title.toLowerCase().includes(searchText) ||
            resource.category.toLowerCase().includes(searchText) ||
            resource.file.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    if (filteredResources.length === 0) {
        emptyMessage.hidden = false;
        resourceList.hidden = true;
        return;
    }

    emptyMessage.hidden = true;
    resourceList.hidden = false;

    filteredResources.forEach(resource => {
        const card = document.createElement("article");
        card.className = "resource-card";

        const encodedURL = resource.url;

        card.innerHTML = `
            <div class="card-top">
                <div class="pdf-icon">PDF</div>
                <span class="category-tag">
                    ${resource.category}
                </span>
            </div>

            <h3>${resource.title}</h3>

            <p class="file-label">${resource.file}</p>

            <div class="card-actions">
                <a
                    href="${encodedURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="read-btn"
                >
                    Read PDF
                </a>

                <a
                    href="${encodedURL}"
                    download="${resource.file}"
                    class="download-btn"
                >
                    Download ↓
                </a>
            </div>
        `;

        resourceList.appendChild(card);
    });
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

searchInput.addEventListener("input", function () {
    searchText = this.value.trim().toLowerCase();
    renderResources();
});

// ========================================
// CLEAR SEARCH
// ========================================

clearSearch.addEventListener("click", function () {
    searchInput.value = "";
    searchText = "";
    renderResources();
});

// ========================================
// CATEGORY FILTERS
// ========================================

filterButtons.forEach(button => {
    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        selectedCategory = this.dataset.filter;

        renderResources();
    });
});

// ========================================
// START WEBSITE
// ========================================

document.addEventListener("DOMContentLoaded", loadResources);

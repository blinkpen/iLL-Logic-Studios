// Load existing posts or start empty
let posts = [];
try {
    posts = JSON.parse(localStorage.getItem("mystic_posts") || "[]");
} catch (e) {
    console.error("Corrupted localStorage, resetting.", e);
    posts = [];
    localStorage.setItem("mystic_posts", "[]");
}

// DOM refs
const feed = document.getElementById("feed");
const addBtn = document.getElementById("add-btn");

const titleInput = document.getElementById("new-title");
const bodyInput = document.getElementById("new-body");
const iconInput = document.getElementById("new-icon");
const imageInput = document.getElementById("new-image");

const filterSelect = document.getElementById("filter-tags");
const tagBadgeContainer = document.getElementById("tag-badges");

// Modal refs
const modal = document.getElementById("modal");
const modalYes = document.getElementById("modal-yes");
const modalNo = document.getElementById("modal-no");
let deleteIndex = null;

// Tags
const TAGS = [
    "Concepts", "Video Games", "Unity Tools", "Websites",
    "Movies", "TV Shows", "Books", "Desktop Apps",
    "Mobile Apps", "Web Apps", "Other"
];

// Colors
const TAG_COLORS = {
    "Concepts": "#8b5cf6",
    "Video Games": "#ef4444",
    "Unity Tools": "#3b82f6",
    "Websites": "#10b981",
    "Movies": "#f59e0b",
    "TV Shows": "#6366f1",
    "Books": "#ec4899",
    "Desktop Apps": "#0ea5e9",
    "Mobile Apps": "#14b8a6",
    "Web Apps": "#84cc16",
    "Other": "#6b7280"
};

let selectedTags = [];

// Sanitize body to prevent JSON breaking
function sanitizeHTML(str) {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, "&quot;")
        .replace(/\n/g, "<br>");
}

// Render tag selector
function renderTagSelector() {
    tagBadgeContainer.innerHTML = "";

    TAGS.forEach(tag => {
        const badge = document.createElement("span");
        badge.className = "tag-select-badge";
        badge.textContent = tag;

        if (selectedTags.includes(tag)) {
            badge.classList.add("selected");
            badge.style.background = TAG_COLORS[tag];
            badge.style.borderColor = TAG_COLORS[tag];
        }

        badge.onclick = () => {
            if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
                badge.classList.remove("selected");
                badge.style.background = "#1f2937";
                badge.style.borderColor = "#374151";
            } else {
                selectedTags.push(tag);
                badge.classList.add("selected");
                badge.style.background = TAG_COLORS[tag];
                badge.style.borderColor = TAG_COLORS[tag];
            }
        };

        tagBadgeContainer.appendChild(badge);
    });
}

// Render feed
function renderFeed() {
    feed.innerHTML = "";
    const selected = filterSelect.value;

    posts
        .filter(p => !selected || (p.tags && p.tags.includes(selected)))
        .forEach((post, index) => {
            const card = document.createElement("div");
            card.className = "card";

            const header = document.createElement("div");
            header.className = "card-header";

            if (post.icon) {
                const icon = document.createElement("img");
                icon.src = post.icon;
                header.appendChild(icon);
            }

            const title = document.createElement("div");
            title.className = "card-title";
            title.textContent = post.title;
            header.appendChild(title);

            if (post.timestamp) {
                const time = new Date(post.timestamp);
                const stamp = document.createElement("div");
                stamp.className = "timestamp";
                stamp.textContent = time.toLocaleString();
                header.appendChild(stamp);
            }

            const del = document.createElement("div");
            del.className = "delete-btn";
            del.innerHTML = "🗑️";
            del.onclick = () => confirmDelete(index);
            header.appendChild(del);

            card.appendChild(header);

            const body = document.createElement("div");
            body.className = "card-body";
            body.innerHTML = post.body;

            if (post.image) {
                const img = document.createElement("img");
                img.src = post.image;
                body.appendChild(img);
            }

            card.appendChild(body);

            if (post.tags && post.tags.length) {
                const tagContainer = document.createElement("div");
                tagContainer.className = "tag-container";

                post.tags.forEach(tag => {
                    const badge = document.createElement("span");
                    badge.className = "tag-badge";
                    badge.textContent = tag;
                    badge.style.background = TAG_COLORS[tag];
                    tagContainer.appendChild(badge);
                });

                card.appendChild(tagContainer);
            }

            feed.appendChild(card);
        });
}

// File → base64
function fileToBase64(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// Add new post
addBtn.onclick = async () => {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
        alert("Title and body required.");
        return;
    }

    if (!iconInput.files[0]) {
        alert("Please upload an icon before posting.");
        return;
    }

    if (selectedTags.length === 0) {
        alert("Please select at least one tag before posting.");
        return;
    }

    const iconData = await fileToBase64(iconInput.files[0]);
    const imageData = imageInput.files[0]
        ? await fileToBase64(imageInput.files[0])
        : null;

    const newPost = {
        title,
        body: sanitizeHTML(body),
        icon: iconData,
        image: imageData,
        timestamp: Date.now(),
        tags: [...selectedTags]
    };

    posts.unshift(newPost);

    // Safe save
    try {
        localStorage.setItem("mystic_posts", JSON.stringify(posts));
    } catch (e) {
        alert("Your entry is too large to save. Try reducing image size.");
        console.error("Save failed:", e);
        posts.shift(); // undo add
        return;
    }

    // Reset
    titleInput.value = "";
    bodyInput.value = "";
    iconInput.value = "";
    imageInput.value = "";
    selectedTags = [];
    renderTagSelector();

    renderFeed();
};

// Delete flow
function confirmDelete(index) {
    deleteIndex = index;
    modal.classList.remove("hidden");
}

modalNo.onclick = () => {
    deleteIndex = null;
    modal.classList.add("hidden");
};

modalYes.onclick = () => {
    if (deleteIndex !== null) {
        posts.splice(deleteIndex, 1);
        localStorage.setItem("mystic_posts", JSON.stringify(posts));
    }

    modal.classList.add("hidden");
    deleteIndex = null;

    renderFeed();
};

filterSelect.onchange = renderFeed;

// Init
renderTagSelector();
renderFeed();

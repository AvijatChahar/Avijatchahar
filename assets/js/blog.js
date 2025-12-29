
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the blog index page or a single post page
    const blogGrid = document.querySelector('.blog-grid');
    const postContainer = document.querySelector('.post-container');

    if (blogGrid) {
        loadBlogList();
    }

    if (postContainer) {
        loadBlogPost();
    }
});

async function loadBlogList() {
    const blogGrid = document.querySelector('.blog-grid');
    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) throw new Error('Failed to load post manifest');

        const posts = await response.json();

        // Clear loading state
        blogGrid.innerHTML = '';

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';

            // Randomly assign a geometric pattern class for visual variety if needed
            // For now, we keep it simple

            card.innerHTML = `
                <div class="blog-card-content">
                    <span class="blog-date">${post.date}</span>
                    <h2 class="blog-title">
                        <a href="post.html?id=${post.id}">${post.title}</a>
                    </h2>
                    <p class="blog-summary">${post.summary}</p>
                    <a href="post.html?id=${post.id}" class="read-more">Read Entry <span class="arrow">→</span></a>
                </div>
            `;

            blogGrid.appendChild(card);
        });

        // Add fade-in animation
        const cards = document.querySelectorAll('.blog-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach((card, index) => {
            setTimeout(() => {
                observer.observe(card);
            }, index * 100);
        });

    } catch (error) {
        console.error('Error loading blogs:', error);
        blogGrid.innerHTML = `<div class="error-container">
            <h3 style="color: #ff4444">Connection Failed</h3>
            <p>Error initializing neural link.</p>
            <p class="error-detail" style="color: #666; font-size: 0.8rem; margin-top: 1rem;">${error.message}</p>
            <p style="color: #888; font-size: 0.9rem; margin-top: 1rem;">
                ensure you are running a local server (e.g., python -m http.server).<br>
                Browsers block file:// access for security.
            </p>
        </div>`;
    }
}

async function loadBlogPost() {
    const postContainer = document.querySelector('.post-container');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postContainer.innerHTML = '<p>Error: No transmission ID specified.</p>';
        return;
    }

    try {
        // 1. Fetch Manifest to find the filename
        const manifestResponse = await fetch('posts/posts.json');
        const posts = await manifestResponse.json();
        const post = posts.find(p => p.id === postId);

        if (!post) {
            throw new Error('Transmission not found.');
        }

        // Update Page Title
        document.title = `${post.title} | Avijat Chahar`;
        document.querySelector('.post-header-title').textContent = post.title;
        document.querySelector('.post-header-date').textContent = post.date;

        // 2. Fetch Markdown Content
        const mdResponse = await fetch(`posts/${post.filename}`);
        if (!mdResponse.ok) throw new Error('Content corrupted.');
        const markdown = await mdResponse.text();

        // 3. Convert to HTML using marked.js
        // marked is loaded via CDN in the HTML file
        const htmlContent = marked.parse(markdown);

        const contentDiv = document.getElementById('markdown-content');
        contentDiv.innerHTML = htmlContent;

    } catch (error) {
        console.error('Error loading post:', error);
        postContainer.innerHTML = `
            <div class="error-container">
                <h2>404 // DATA CORRUPTION</h2>
                <p>The requested transmission could not be established.</p>
                <p class="error-detail" style="color: #666; font-size: 0.8rem; margin-top: 1rem;">${error.message}</p>
                <a href="blog.html" class="back-link">Return to Index</a>
            </div>
        `;
    }
}

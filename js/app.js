document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');

    if (headerPlaceholder) {
        // Try to fetch header from a path relative to the root for pages like index.html
        fetch('templates/header.html')
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                // If that fails, it might be a nested page like posts/sample-post.html
                // So, try a path relative to a subdirectory
                return fetch('../templates/header.html').then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    // If both fail, throw an error
                    throw new Error('Header file not found in standard locations.');
                });
            })
            .then(html => {
                headerPlaceholder.innerHTML = html;
                // Adjust nav links for nested pages
                const isNested = window.location.pathname.includes('/posts/');
                if (isNested) {
                    const navLinks = headerPlaceholder.querySelectorAll('nav a');
                    navLinks.forEach(link => {
                        const originalHref = link.getAttribute('href');
                        if (originalHref && !originalHref.startsWith('http')) {
                            link.setAttribute('href', `../${originalHref}`);
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = '<p style="color: red;">Error: Could not load header.</p>';
            })
            .finally(() => {
                // Make the main content visible after header loading attempt
                document.querySelector('main').style.visibility = 'visible';
            });
    }

    const postList = document.getElementById('post-list');
    if (postList) {
        // This is a simple, hardcoded list of posts for demonstration.
        // For a real blog, you would fetch this from a JSON file or an API.
        const posts = [
            {
                title: "My First Blog Post",
                url: "posts/sample-post.html"
            }
        ];

        posts.forEach(post => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = post.url;
            link.textContent = post.title;
            listItem.appendChild(link);
            postList.appendChild(listItem);
        });
    }
});
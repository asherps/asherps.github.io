// This function runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Find all links on the page
    const allLinks = document.querySelectorAll('a');

    // Add click event listener to each link
    allLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Skip if href is null or undefined
        if (!href) return;

        // Check if the link points to readings.html using various possible formats
        if (href === 'readings.html' ||
            href === '../readings.html' ||
            href === '/readings.html' ||
            href.endsWith('/readings.html') ||
            href.match(/\/readings\.html$/)) {

            link.addEventListener('click', function (event) {
                // Prevent the default navigation
                event.preventDefault();

                // Show an error message
                alert('The Readings page is currently under maintenance. Please check back later!');
            });
        }
    });
});

// Also handle direct access to readings.html
if (window.location.pathname.endsWith('readings.html')) {
    // Replace the entire page content with an error message
    document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1 style="color: #2e7d32;">Page Under Maintenance</h1>
            <p style="font-size: 18px; margin: 20px 0;">The Readings page is currently under maintenance. Please check back later!</p>
            <a href="index.html" style="color: #2e7d32; text-decoration: none; font-weight: bold;">Return to Home</a>
        </div>
    `;
}
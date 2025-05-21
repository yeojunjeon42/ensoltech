class FloodTransition {
    constructor() {
        this.transitionElement = document.createElement('div');
        this.transitionElement.className = 'flood-transition';
        document.body.appendChild(this.transitionElement);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .flood-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #224881;
                z-index: 9999;
                transform: scaleY(0);
                transform-origin: bottom;
                transition: transform 0.6s cubic-bezier(0.7, 0, 0.3, 1);
                pointer-events: none;
            }
            .flood-transition.active {
                transform: scaleY(1);
                transform-origin: top;
            }
        `;
        document.head.appendChild(style);
    }

    async transitionTo(url) {
        // Start transition
        this.transitionElement.classList.add('active');
        
        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Navigate to new page
        window.location.href = url;
    }
}

// Initialize transition
const floodTransition = new FloodTransition();

// Add click event listeners to all navigation links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        // Skip external links and links with target="_blank"
        if (link.hostname === window.location.hostname && !link.target) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                floodTransition.transitionTo(link.href);
            });
        }
    });
}); 
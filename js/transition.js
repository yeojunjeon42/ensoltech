// Prevent double inclusion
if (!window.FloodTransitionLoaded) {
    window.FloodTransitionLoaded = true;

    class BlurTransition {
        constructor() {
            this.createOverlay();
            // On page load, if the blur is up, fade it out
            if (sessionStorage.getItem('blurTransitionUp') === '1') {
                this.overlay.style.opacity = '1';
                setTimeout(() => {
                    this.overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (this.overlay.parentNode) {
                            this.overlay.parentNode.removeChild(this.overlay);
                        }
                    }, 500); // match transition duration
                }, 50);
                sessionStorage.removeItem('blurTransitionUp');
            } else {
                this.overlay.style.opacity = '0';
            }
            // Hide on back navigation
            window.addEventListener('pageshow', () => {
                this.createOverlay();
                this.overlay.style.opacity = '0';
            });
        }

        createOverlay() {
            // Remove any existing overlay
            const oldOverlay = document.getElementById('blur-transition-overlay');
            if (oldOverlay) oldOverlay.remove();
            // Create overlay
            this.overlay = document.createElement('div');
            this.overlay.id = 'blur-transition-overlay';
            this.overlay.style.position = 'fixed';
            this.overlay.style.left = '0';
            this.overlay.style.top = '0';
            this.overlay.style.width = '100vw';
            this.overlay.style.height = '100vh';
            this.overlay.style.zIndex = '9999';
            this.overlay.style.pointerEvents = 'none';
            this.overlay.style.background = '#224881';
            this.overlay.style.backdropFilter = 'blur(16px)';
            this.overlay.style.transition = 'opacity 0.5s cubic-bezier(0.7, 0, 0.3, 1)';
            this.overlay.style.opacity = '0';
            document.body.appendChild(this.overlay);
        }

        async transitionTo(url) {
            this.createOverlay();                   // overlay now in DOM at opacity:0
            void this.overlay.offsetWidth;          // force reflow
            this.overlay.style.opacity = '1';       // now transition will animate
            sessionStorage.setItem('blurTransitionUp', '1');
            await new Promise(r => setTimeout(r, 500));
            window.location.href = url;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const blurTransition = new BlurTransition();
        // Event delegation for all clicks
        document.body.addEventListener('click', function(e) {
            // Find the closest anchor element
            let link = e.target;
            while (link && link.tagName !== 'A') link = link.parentElement;
            if (!link) return;
            // Only handle internal links (same hostname, not _blank, not javascript:)
            if (
                link.hostname === window.location.hostname &&
                !link.target &&
                !link.href.startsWith('javascript:') &&
                link.getAttribute('href') &&
                !link.getAttribute('href').startsWith('#')
            ) {
                e.preventDefault();
                blurTransition.transitionTo(link.href);
            }
        });
    });
} 
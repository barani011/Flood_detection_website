// Live Video Configuration
// Update these URLs with your actual live stream links

const LIVE_STREAMS = {
    tirunelveli: {
        name: 'Tirunelveli - Town, street no: 02',
        videoUrl: 'https://www.youtube.com/embed/IV3Fnoaljfs', // YouTube Live Stream
        fallbackImage: 'https://images.unsplash.com/photo-1541913053120-058e39a615d5?auto=format&fit=crop&q=80&w=800',
        isYoutube: true
    },
    // Add more locations as needed
};

// Function to check if URL is YouTube
function isYoutubeUrl(url) {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

// Function to convert YouTube watch URL to embed URL
function convertYoutubeUrl(url) {
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/embed/')) {
        return url;
    }
    return url;
}

// Initialize live video on page load
document.addEventListener('DOMContentLoaded', () => {
    const liveVideo = document.getElementById('liveVideo');
    const fallbackImage = document.getElementById('fallbackImage');
    const videoContainer = document.querySelector('.video-container');
    
    // Use Tirunelveli stream by default
    const streamConfig = LIVE_STREAMS.tirunelveli;
    
    if (streamConfig.isYoutube || isYoutubeUrl(streamConfig.videoUrl)) {
        // Handle YouTube embed
        const embedUrl = convertYoutubeUrl(streamConfig.videoUrl);
        if (liveVideo) liveVideo.style.display = 'none';
        if (fallbackImage) fallbackImage.style.display = 'none';
        
        // Create iframe for YouTube
        const iframe = document.createElement('iframe');
        iframe.id = 'youtubePlayer';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = embedUrl + '?autoplay=1';
        iframe.frameborder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.borderRadius = '0';
        
        // Insert after video container children
        const videoOverlay = videoContainer.querySelector('.video-overlay-top');
        if (videoOverlay) {
            videoContainer.insertBefore(iframe, videoOverlay.nextSibling);
        } else {
            videoContainer.insertBefore(iframe, videoContainer.firstChild);
        }
    } else if (streamConfig.videoUrl) {
        // Load regular video
        liveVideo.src = streamConfig.videoUrl;
        fallbackImage.style.display = 'none';
    } else {
        // Show fallback image if no video URL
        fallbackImage.style.display = 'block';
        liveVideo.style.display = 'none';
    }
});

// Function to change live stream
function setLiveStream(location) {
    const liveVideo = document.getElementById('liveVideo');
    const fallbackImage = document.getElementById('fallbackImage');
    const videoContainer = document.querySelector('.video-container');
    const streamConfig = LIVE_STREAMS[location];
    
    // Remove existing YouTube iframe if present
    const existingIframe = videoContainer.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    if (streamConfig && (streamConfig.isYoutube || isYoutubeUrl(streamConfig.videoUrl))) {
        // Handle YouTube embed
        const embedUrl = convertYoutubeUrl(streamConfig.videoUrl);
        if (liveVideo) liveVideo.style.display = 'none';
        if (fallbackImage) fallbackImage.style.display = 'none';
        
        // Create new iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'youtubePlayer';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = embedUrl + '?autoplay=1';
        iframe.frameborder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.borderRadius = '0';
        
        // Insert into container
        const videoOverlay = videoContainer.querySelector('.video-overlay-top');
        if (videoOverlay) {
            videoContainer.insertBefore(iframe, videoOverlay.nextSibling);
        } else {
            videoContainer.appendChild(iframe);
        }
    } else if (streamConfig && streamConfig.videoUrl) {
        // Handle regular video
        liveVideo.style.display = 'block';
        liveVideo.src = streamConfig.videoUrl;
        fallbackImage.style.display = 'none';
    } else if (streamConfig) {
        // Show fallback image
        fallbackImage.src = streamConfig.fallbackImage;
        fallbackImage.style.display = 'block';
        liveVideo.style.display = 'none';
    }
}

// Example: Add event listeners to location cards to switch streams
document.querySelectorAll('.status-card').forEach((card, index) => {
    card.addEventListener('dblclick', () => {
        // Double-click to preview that location's stream on dashboard
        const locations = ['tirunelveli', 'chennai', 'madurai'];
        if (locations[index]) {
            setLiveStream(locations[index]);
        }
    });
});

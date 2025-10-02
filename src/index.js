// write your code here
document.addEventListener('DOMContentLoaded', () => {
    const ramenMenu = document.getElementById('ramen-menu');
    // Detail elements
    const detailImage = document.querySelector('.detail-image');
    const ramenName = document.querySelector('.name');
    const ramenRestaurant = document.querySelector('.restaurant');
    const ratingDisplay = document.getElementById('rating-display');
    const commentDisplay = document.getElementById('comment-display');
    // Forms and buttons
    const newRamenForm = document.getElementById('new-ramen');
    const editRamenForm = document.getElementById('edit-ramen');
    const deleteBtn = document.getElementById('delete-btn');

    const ramenApiUrl = 'http://localhost:3000/ramens';

    let currentRamen = null; // To keep track of the currently displayed ramen

    /**
     * Resets the detail view to its placeholder state.
     */
    function resetDetailView() {
        detailImage.src = './assets/image-placeholder.jpg';
        detailImage.alt = 'Insert Name Here';
        ramenName.textContent = 'Insert Name Here';
        ramenRestaurant.textContent = 'Insert Restaurant Here';
        ratingDisplay.textContent = 'Insert rating here';
        commentDisplay.textContent = 'Insert comment here';
        currentRamen = null;
    }

    /**
     * Displays the details of a single ramen object.
     * @param {object} ramen - The ramen object to display.
     */
    function displayRamenDetails(ramen) {
        currentRamen = ramen;
        detailImage.src = ramen.image;
        detailImage.alt = ramen.name;
        ramenName.textContent = ramen.name;
        ramenRestaurant.textContent = ramen.restaurant;
        ratingDisplay.textContent = ramen.rating;
        commentDisplay.textContent = ramen.comment;
        // Also update the edit form placeholders
        document.getElementById('update-rating').value = ramen.rating;
        document.getElementById('update-comment').value = ramen.comment;
    }

    /**
     * Creates and appends a ramen image to the menu.
     * @param {object} ramen - The ramen object to render.
     */
    function renderRamenToMenu(ramen) {
        const img = document.createElement('img');
        // Use a data attribute to store the id for easier lookup
        img.dataset.id = ramen.id;
        img.src = ramen.image;
        img.alt = ramen.name;
        img.addEventListener('click', () => displayRamenDetails(ramen));
        ramenMenu.appendChild(img);
    }

    // Fetch all ramens, display them, and show details for the first one
    fetch(ramenApiUrl)
        .then(response => response.json())
        .then(ramens => {
            ramens.forEach(renderRamenToMenu);
            // Advanced Deliverable: Show details for the first ramen on load
            if (ramens.length > 0) {
                displayRamenDetails(ramens[0]);
            }
        })
        .catch(error => console.error('Error fetching ramens:', error));

    // Handle new ramen form submission
    newRamenForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newRamen = {
            name: event.target['new-name'].value,
            restaurant: event.target['new-restaurant'].value,
            image: event.target['new-image'].value,
            rating: event.target['new-rating'].value,
            comment: event.target['new-comment'].value
        };

        // Extra Advanced: Persist the new ramen (POST request)
        fetch(ramenApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRamen),
        })
        .then(response => response.json())
        .then(createdRamen => {
            renderRamenToMenu(createdRamen);
            newRamenForm.reset();
        })
        .catch(error => console.error('Error creating ramen:', error));
    });

    // Advanced Deliverable: Handle edit ramen form submission
    editRamenForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!currentRamen) return; // Do nothing if no ramen is selected

        const newRating = event.target['update-rating'].value;
        const newComment = event.target['update-comment'].value;

        // Extra Advanced: Persist the update (PATCH request)
        fetch(`${ramenApiUrl}/${currentRamen.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating: newRating,
                comment: newComment,
            }),
        })
        .then(response => response.json())
        .then(updatedRamen => {
            // Update the display and the in-memory object
            displayRamenDetails(updatedRamen);
        })
        .catch(error => console.error('Error updating ramen:', error));

    });

    // Advanced Deliverable: Handle delete button click
    deleteBtn.addEventListener('click', () => {
        if (!currentRamen) return; // Do nothing if no ramen is selected

        // Find the image in the menu and remove it
        // Extra Advanced: Persist the deletion (DELETE request)
        fetch(`${ramenApiUrl}/${currentRamen.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                const imageToRemove = ramenMenu.querySelector(`[data-id='${currentRamen.id}']`);
                if (imageToRemove) {
                    imageToRemove.remove();
                }
                resetDetailView();
            }
        })
        .catch(error => console.error('Error deleting ramen:', error));
    });
});

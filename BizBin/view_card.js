document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('cardContainer');

    // Function to fetch and display cards
    function fetchAndDisplayCards() {
        // Retrieve card data from localStorage
        const cardList = JSON.parse(localStorage.getItem('cardList')) || [];

        // Clear existing cards
        cardContainer.innerHTML = '';

        // Display all cards
        cardList.forEach(card => {
            const cardElement = createCardElement(card);
            cardContainer.appendChild(cardElement);
        });
    }

    // Function to create card HTML element
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    // Populate card content
    cardElement.innerHTML = `
        <h2>${card.title}</h2>
        <p data-field="date">Date: ${card.date}</p>
        <p data-field="time">Time: ${card.time}</p>
        <p data-field="event">Event: ${card.event}</p>
        <p data-field="description">Description: ${card.description}</p>
        <img src="${card.imageData}" alt="Card Image"> <!-- Display image -->
        <button class="edit-btn" data-card-id="${card.sequenceNumber}">Edit</button>
        <button class="delete-btn" data-card-id="${card.sequenceNumber}">Delete</button>
    `;

    // Add event listener to the edit button
    const editButton = cardElement.querySelector('.edit-btn');
    editButton.addEventListener('click', () => handleEditCard(cardElement, card));

    // Add event listener to the delete button
    const deleteButton = cardElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => handleDeleteCard(card));

    return cardElement;
}
// Function to handle editing a card
function handleEditCard(cardElement, card) {
    const editButton = cardElement.querySelector('.edit-btn');
    const deleteButton = cardElement.querySelector('.delete-btn');
    const doneButton = document.createElement('button');

    // Change button states
    editButton.style.display = 'none';
    deleteButton.style.display = 'none';

    doneButton.textContent = 'Done';
    doneButton.classList.add('done-btn');
    cardElement.appendChild(doneButton);

    // Create form elements for editing
    const form = document.createElement('form');
    form.id = 'editCardForm';

    const formFields = ['date', 'time', 'title', 'description', 'event', 'nearestPlace', 'image'];
    formFields.forEach(field => {
        const label = document.createElement('label');
        label.setAttribute('for', field);
        label.textContent = field.charAt(0).toUpperCase() + field.slice(1) + ':';

        const input = document.createElement('input');
        input.setAttribute('type', field === 'date' ? 'date' : field === 'time' ? 'time' : field === 'image' ? 'file' : 'text');
        input.setAttribute('id', field);
        input.setAttribute('name', field);
        input.setAttribute('value', card[field]); // Set initial value

        const div = document.createElement('div');
        div.classList.add('form-group');
        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });

    // Append form to card element
    cardElement.appendChild(form);

    // Add event listener to the "Done" button
    doneButton.addEventListener('click', function handleDoneClick() {
        const formData = new FormData(form);

        // Update card data with the new input values
        formFields.forEach(field => {
            card[field] = formData.get(field);
        });

        // Update card in localStorage
        let cardList = JSON.parse(localStorage.getItem('cardList')) || [];
        const index = cardList.findIndex(item => item.sequenceNumber === card.sequenceNumber);
        cardList[index] = card;
        localStorage.setItem('cardList', JSON.stringify(cardList));

        // Re-render the card with updated details
        fetchAndDisplayCards();

        // Remove form and done button
        form.remove();
        doneButton.remove();

        // Restore original button states
        editButton.style.display = 'inline';
        deleteButton.style.display = 'inline';

        // Remove event listener for the "Done" button
        doneButton.removeEventListener('click', handleDoneClick);
    });
}
    // Function to handle deleting a card
    function handleDeleteCard(card) {
        // Remove card from localStorage
        let cardList = JSON.parse(localStorage.getItem('cardList')) || [];
        cardList = cardList.filter(item => item.sequenceNumber !== card.sequenceNumber);
        localStorage.setItem('cardList', JSON.stringify(cardList));

        // Fetch and display updated card list
        fetchAndDisplayCards();

        // Provide feedback to the user
        alert('Card deleted successfully.'); // You can customize this message or use other UI feedback methods
    }

    // Initial fetch and display of cards when the page loads
    fetchAndDisplayCards();
});

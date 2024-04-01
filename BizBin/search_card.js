document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchTypeSelect = document.getElementById('searchType');
    const searchQueryInput = document.getElementById('searchQuery');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedSearchType = searchTypeSelect.value;
        const searchQuery = searchQueryInput.value.trim().toLowerCase();

        // Perform search based on the selected type and query
        const searchResults = performSearch(selectedSearchType, searchQuery);

        // Display search results
        displaySearchResults(searchResults);
    });

    // Function to perform search based on title, event, description, or time
    function performSearch(type, query) {
        if (type === 'title') {
            // Perform title-based search
            return performTitleSearch(query);
        } else if (type === 'date') {
            // Perform date-based search
            return performDateSearch(query);
        } else if (type === 'event') {
            // Perform event-based search
            return performEventSearch(query);
        } else if (type === 'description') {
            // Perform description-based search
            return performDescriptionSearch(query);
        } else if (type === 'time') {
            // Perform time-based search
            return performTimeSearch(query);
        } else {
            // Unsupported search type
            console.log('Unsupported search type');
            return [];
        }
    }

    // Function to perform title-based search
    function performTitleSearch(query) {
        // Retrieve card data from localStorage
        const cardList = JSON.parse(localStorage.getItem('cardList')) || [];

        // Filter cards based on title
        const searchResults = cardList.filter(card => {
            return card.title.toLowerCase().includes(query);
        });

        return searchResults;
    }

    // Function to perform date-based search
    function performDateSearch(query) {
        // Retrieve card data from localStorage
        const cardList = JSON.parse(localStorage.getItem('cardList')) || [];

        // Filter cards based on date
        const searchResults = cardList.filter(card => {
            return card.date === query;
        });

        return searchResults;
    }

    // Function to perform event-based search
    function performEventSearch(query) {
        // Retrieve card data from localStorage
        const cardList = JSON.parse(localStorage.getItem('cardList')) || [];

        // Filter cards based on event
        const searchResults = cardList.filter(card => {
            return card.event.toLowerCase().includes(query);
        });

        return searchResults;
    }

    // Function to perform description-based search
    function performDescriptionSearch(query) {
        // Retrieve card data from localStorage
        const cardList = JSON.parse(localStorage.getItem('cardList')) || [];

        // Filter cards based on description
        const searchResults = cardList.filter(card => {
            return card.description.toLowerCase().includes(query);
        });

        return searchResults;
    }

    // Function to perform time-based search
    function performTimeSearch(query) {
        // Retrieve card data from localStorage
        const cardList = JSON.parse(localStorage.getItem('cardList')) || [];

        // Filter cards based on time
        const searchResults = cardList.filter(card => {
            return card.time === query;
        });

        return searchResults;
    }

    // Function to display search results
    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('searchResults');
        searchResultsContainer.innerHTML = '';

        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p>No matching cards found.</p>';
        } else {
            results.forEach(result => {
                const cardElement = createCardElement(result);
                searchResultsContainer.appendChild(cardElement);
            });
        }
    }

    // Function to create card HTML element
    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        // Populate card content
        cardElement.innerHTML = `
            <h2>${card.title}</h2>
            <p>Date: ${card.date}</p>
            <p>Time: ${card.time}</p>
            <p>Event: ${card.event}</p>
            <p>Description: ${card.description}</p>
            <button class="edit-btn" data-card-id="${card.sequenceNumber}">Edit</
            button>
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

        // Replace card content with input fields
        const formFields = ['date', 'time', 'title', 'description', 'event', 'nearestPlace', 'image'];
        formFields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.charAt(0).toUpperCase() + field.slice(1) + ':';
            const input = document.createElement('input');
            input.setAttribute('type', field === 'date' ? 'date' : field === 'time' ? 'time' : field === 'image' ? 'file' : 'text');
            input.setAttribute('id', field);
            input.setAttribute('name', field);
            input.value = card[field];

            const div = document.createElement('div');
            div.classList.add('form-group');
            div.appendChild(label);
            div.appendChild(input);
            cardElement.appendChild(div);
        });

        // Add event listener to the "Done" button
        doneButton.addEventListener('click', function handleDoneClick() {
            // Update card data with the new input values
            cardElement.querySelectorAll('p input').forEach(input => {
                const field = input.id;
                card[field] = input.value;
            });

            // Update card in localStorage
            let cardList = JSON.parse(localStorage.getItem('cardList')) || [];
            const index = cardList.findIndex(item => item.sequenceNumber === card.sequenceNumber);
            cardList[index] = card;
            localStorage.setItem('cardList', JSON.stringify(cardList));

            // Re-render the card with updated details
            fetchAndDisplayCards();

            // Restore original button states
            editButton.style.display = 'inline';
            deleteButton.style.display = 'inline';

            // Remove "Done" button and hide input fields
            doneButton.remove();
            cardElement.querySelectorAll('p input').forEach(input => {
                input.style.display = 'none';
            });

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
});

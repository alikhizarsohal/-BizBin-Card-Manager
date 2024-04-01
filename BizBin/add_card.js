class CardForm {
    constructor(formElement) {
        this.form = formElement;
        this.successMessage = document.getElementById('successMessage');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();

        const formData = this.getFormData();

        // Get the sequential number from local storage
        let sequenceNumber = localStorage.getItem('sequenceNumber') || 1;

        // Get the selected image file
        const imageInput = this.form.querySelector('#image');
        const imageFile = imageInput.files[0]; // Assuming only one file is selected

        // Read the selected image file as a Base64-encoded string
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;

                // Store card information and image data
                this.storeCard(formData, sequenceNumber, imageData);

                // Increment and save the sequential number for the next card
                sequenceNumber++;
                localStorage.setItem('sequenceNumber', sequenceNumber);

                // Display success message
                this.displaySuccessMessage();

                // Redirect to homepage after a delay
                setTimeout(() => {
                    window.location.href = 'add_card.html'; // Redirect to homepage
                }, 2000); // Delay for 2 seconds (2000 milliseconds)
            };

            reader.readAsDataURL(imageFile);
        } else {
            alert('Please select an image.');
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const cardData = {};
        formData.forEach((value, key) => {
            cardData[key] = value;
        });
        return cardData;
    }

    storeCard(formData, sequenceNumber, imageData) {
        // Combine card data, sequence number, and image data into one object
        const cardInfo = { ...formData, sequenceNumber, imageData };

        // Save card information to localStorage
        let cardList = JSON.parse(localStorage.getItem('cardList') || '[]');
        cardList.push(cardInfo);
        localStorage.setItem('cardList', JSON.stringify(cardList));
    }

    displaySuccessMessage() {
        // Show the success message
        this.successMessage.style.display = 'block';
        // Remove the success message after 3 seconds
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 3000); // Delay for 3 seconds (3000 milliseconds)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('addCardForm');
    const cardForm = new CardForm(formElement);
});

import showModal from './modal';

export default function showWinnerModal(winner) {
    // Assuming you have a modal container with the id "winnerModal"
    const modalContainer = document.getElementById('winnerModal');

    // Check if the modal container exists
    if (!modalContainer) {
        console.error('Modal container not found');
        return;
    }

    // Clear the modal content
    modalContainer.innerHTML = '';

    // Create elements to display winner information
    const winnerContainer = document.createElement('div');
    winnerContainer.className = 'modal-winner';

    const winnerElement = document.createElement('h2');
    winnerElement.innerText = `Winner: ${winner.name}`;

    // Add other winner details as needed

    // Append elements to the modal container
    winnerContainer.append(winnerElement);
    modalContainer.appendChild(winnerContainer);

    // Display the modal
    showModal('winnerModal');
}

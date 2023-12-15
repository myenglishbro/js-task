import createElement from '../helpers/domHelper';
import { getFighterInfo } from './fighterSelector';

export async function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    
    // Call getFighterPreviewContent to get the resolved content
    const content = await getFighterPreviewContent(fighter);

    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`,
        content: content // Use the resolved content here
    });

    fighterElement.addEventListener('click', async () => {
        const fighterDetails = await getFighterInfo(fighter.id);
        displayFighterDetails(fighterDetails);
    });

    return fighterElement;
}


export async function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

async function getFighterPreviewContent(fighter) {
    if (!fighter || !fighter.name || !fighter.health) {
        return 'Fighter information not available';
    }

    const imageElement = await createFighterImage(fighter);
    
    return `
        ${imageElement.outerHTML}
        <div class="fighter-info">
            <h2>${fighter.name}</h2>
            <p>Health: ${fighter.health}</p>
            <!-- Add other properties as needed -->
        </div>
    `;
}


function displayFighterDetails(fighterDetails) {
    // Assuming there's a modal container in your HTML with the id "fighterDetailsModal"
    const modalContainer = document.getElementById('fighterDetailsModal');

    // Check if the modal container exists
    if (!modalContainer) {
        console.error('Modal container not found');
        return;
    }

    // Clear the modal content
    modalContainer.innerHTML = '';

    // Create elements to display fighter details
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'modal-details';

    const nameElement = document.createElement('h2');
    nameElement.innerText = fighterDetails.name;

    const healthElement = document.createElement('p');
    healthElement.innerText = `Health: ${fighterDetails.health}`;

    // Add other properties as needed

    // Append elements to the modal container
    detailsContainer.append(nameElement, healthElement);
    modalContainer.appendChild(detailsContainer);

    // Display the modal (assuming you have a function to handle modal display)
    showFighterDetailsModal();
}

// Example function to show the modal
function showFighterDetailsModal() {
    const modalContainer = document.getElementById('fighterDetailsModal');

    // Assuming you have a CSS class to show the modal
    modalContainer.classList.add('show-modal');
}


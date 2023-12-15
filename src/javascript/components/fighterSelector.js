import createElement from '../helpers/domHelper';
import renderArena from './arena';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import fighterService from '../services/fightersService';

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId) {
    let fighterInfo = fighterDetailsMap.get(fighterId);

    if (!fighterInfo) {
        // If fighter info is not in the map, fetch it from the service
        try {
            fighterInfo = await fighterService.getFighterDetails(fighterId);
            fighterDetailsMap.set(fighterId, fighterInfo);
        } catch (error) {
            console.error(`Error fetching fighter details for fighter ID ${fighterId}:`, error);
            // Handle error gracefully
        }
    }

    return fighterInfo;
}

function startFight(selectedFighters) {
    renderArena(selectedFighters);
}

function createVersusBlock(selectedFighters) {
    const canStartFight = selectedFighters.filter(Boolean).length === 2;
    const onClick = () => startFight(selectedFighters);
    const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
    const image = createElement({
        tagName: 'img',
        className: 'preview-container___versus-img',
        attributes: { src: versusImg }
    });
    const disabledBtn = canStartFight ? '' : 'disabled';
    const fightBtn = createElement({
        tagName: 'button',
        className: `preview-container___fight-btn ${disabledBtn}`
    });

    fightBtn.addEventListener('click', onClick, false);
    fightBtn.innerText = 'Fight';
    container.append(image, fightBtn);

    return container;
}

function renderSelectedFighters(selectedFighters) {
    const fightersPreview = document.querySelector('.preview-container___root');
    const [playerOne, playerTwo] = selectedFighters;
    const firstPreview = createFighterPreview(playerOne, 'left');
    const secondPreview = createFighterPreview(playerTwo, 'right');
    const versusBlock = createVersusBlock(selectedFighters);

    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
}

export function createFightersSelector() {
    let selectedFighters = [];

    return async (event, fighterId) => {
        const fighter = await getFighterInfo(fighterId);
        const [playerOne, playerTwo] = selectedFighters;
        const firstFighter = playerOne ?? fighter;
        const secondFighter = playerOne ? playerTwo ?? fighter : playerTwo;
        selectedFighters = [firstFighter, secondFighter];

        renderSelectedFighters(selectedFighters);
    };
}

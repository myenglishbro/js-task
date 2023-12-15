// fight.js

import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(async (resolve) => {
        const playerOneKeys = Object.values(controls).filter(key => key.startsWith('PlayerOne'));
        const playerTwoKeys = Object.values(controls).filter(key => key.startsWith('PlayerTwo'));

        let playerOneCanHit = true;
        let playerTwoCanHit = true;

        let playerOneLastHitTime = 0;
        let playerTwoLastHitTime = 0;

        const processKey = (event) => {
            const currentTime = Date.now();

            if (event.code === controls.PlayerOneAttack && playerOneCanHit) {
                playerOneCanHit = false;
                const damage = getDamage(firstFighter, secondFighter);
                secondFighter.health -= damage;
                updateHealthBar('second', secondFighter.health);
                playerOneLastHitTime = currentTime;
            }

            if (event.code === controls.PlayerTwoAttack && playerTwoCanHit) {
                playerTwoCanHit = false;
                const damage = getDamage(secondFighter, firstFighter);
                firstFighter.health -= damage;
                updateHealthBar('first', firstFighter.health);
                playerTwoLastHitTime = currentTime;
            }

            if (event.code === controls.PlayerOneBlock) {
                playerOneCanHit = true;
            }

            if (event.code === controls.PlayerTwoBlock) {
                playerTwoCanHit = true;
            }
        };

        document.addEventListener('keydown', processKey);

        const intervalId = setInterval(() => {
            const currentTime = Date.now();

            if (!playerOneCanHit && currentTime - playerOneLastHitTime >= 10000) {
                playerOneCanHit = true;
            }

            if (!playerTwoCanHit && currentTime - playerTwoLastHitTime >= 10000) {
                playerTwoCanHit = true;
            }

            if (firstFighter.health <= 0 || secondFighter.health <= 0) {
                clearInterval(intervalId);
                document.removeEventListener('keydown', processKey);
                resolve(firstFighter.health > secondFighter.health ? firstFighter : secondFighter);
            }
        }, 1000);
    });
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);

    return Math.max(0, hitPower - blockPower);
}

export function getHitPower(fighter) {
    const { attack, criticalHitChance } = fighter;
    const criticalHit = Math.random() < criticalHitChance;
    return criticalHit ? 2 * attack : attack;
}

export function getBlockPower(fighter) {
    const { defense, dodgeChance } = fighter;
    const dodge = Math.random() < dodgeChance;
    return dodge ? 0 : defense;
}

function updateHealthBar(player, health) {
    const healthBar = document.querySelector(`.fighter-preview___${player} .health-bar`);
    if (healthBar) {
        healthBar.style.width = `${health}%`;
    }
}

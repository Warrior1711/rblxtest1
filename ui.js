// Roblox Limiteds - Simple UI Logic (with style and images)

import { items } from './items.js';
import { player, leaderboard, playerBuy, playerSell, startGame, stopGame, nextDropSeconds } from './game.js';

function renderLeaderboard() {
  const lb = document.getElementById('leaderboard');
  lb.innerHTML =
    '<h3>Leaderboard</h3><table><tr><th>Rank</th><th>Name</th><th>Net Worth</th></tr>' +
    leaderboard
      .map(
        (t, i) =>
          `<tr><td>${i + 1}</td><td>${t.name}</td><td>${t.netWorth}</td></tr>`
      )
      .join('') +
    '</table>';
}

function renderInventory() {
  const inv = document.getElementById('inventory');
  if (player.inventory.length === 0) {
    inv.innerHTML = `<h3>Your Inventory</h3><div>No items owned yet.</div><div style="margin-top:.7em;"><b>Cash:</b> ${player.cash}</div>`;
    return;
  }
  inv.innerHTML =
    '<h3>Your Inventory</h3>' +
    player.inventory
      .map(
        id => {
          const it = items.find(it => it.id === id);
          return `<div style="display:flex;align-items:center;gap:0.8em;margin-bottom:0.3em;">
            <img class="item-img" src="${it?.image || ''}" alt="" />
            <span>${it?.name || id}</span>
            <button onclick="sellItem('${id}')">Sell</button>
          </div>`;
        }
      )
      .join('') +
    `<div style="margin-top:.7em;"><b>Cash:</b> ${player.cash}</div>`;
}

function renderItems() {
  const itemsDiv = document.getElementById('items');
  itemsDiv.innerHTML =
    '<h3>Market</h3>' +
    items
      .map(
        it =>
          `<div class="item-card">
            <img class="item-img" src="${it.image}" alt="" />
            <div class="item-info">
              <b>${it.name}</b>
              <div style="margin-bottom:0.2em;">
                <span style="color:#666; font-size:0.95em;">${it.description || ''}</span>
              </div>
              <div>
                <span style="color:#1a202c;">RAP:</span> <b>${it.rap}</b> | 
                <span style="color:#1a202c;">Stock:</span> <b>${it.stock}/${it.maxStock}</b>
              </div>
              <div class="item-tags">
                ${it.tags.map(tag => `<span class="item-tag ${tag}">${tag.charAt(0).toUpperCase()+tag.slice(1)}</span>`).join('')}
              </div>
              <button onclick="buyItem('${it.id}')">Buy</button>
              <div class="chart-row">RAP chart: [${it.chart.map(c => c.rap).join(', ')}]</div>
              <div class="chart-row">Volume: [${it.chart.map(c => c.price).join(', ')}]</div>
            </div>
          </div>`
      )
      .join('');
}

window.buyItem = function (id) {
  playerBuy(id);
  renderAll();
};

window.sellItem = function (id) {
  const price = prompt('Enter sale price:');
  if (price && !isNaN(price)) {
    playerSell(id, parseInt(price));
    renderAll();
  }
};

function renderAll() {
  renderLeaderboard();
  renderInventory();
  renderItems();
}

export function setupUI() {
  document.getElementById('start').onclick = () => {
    startGame(renderAll);
  };
  document.getElementById('stop').onclick = () => {
    stopGame();
  };
  renderAll();
}


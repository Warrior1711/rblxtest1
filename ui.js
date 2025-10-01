// Roblox Limiteds - Simple UI Logic

import { items } from './items.js';
import { player, leaderboard, playerBuy, playerSell, startGame, stopGame } from './game.js';

function renderLeaderboard() {
  const lb = document.getElementById('leaderboard');
  lb.innerHTML =
    '<tr><th>Rank</th><th>Name</th><th>Net Worth</th></tr>' +
    leaderboard
      .map(
        (t, i) =>
          `<tr><td>${i + 1}</td><td>${t.name}</td><td>${t.netWorth}</td></tr>`
      )
      .join('');
}

function renderInventory() {
  const inv = document.getElementById('inventory');
  inv.innerHTML =
    '<h3>Your Inventory</h3>' +
    player.inventory
      .map(
        id =>
          `<span>${items.find(it => it.id === id).name}</span><button onclick="sellItem('${id}')">Sell</button>`
      )
      .join('<br>');
}

function renderItems() {
  const itemsDiv = document.getElementById('items');
  itemsDiv.innerHTML =
    '<h3>Market</h3>' +
    items
      .map(
        it =>
          `<div>
            <b>${it.name}</b> [${it.tags.join(', ')}] <br>
            RAP: ${it.rap} | Stock: ${it.stock}/${it.maxStock} <br>
            <button onclick="buyItem('${it.id}')">Buy</button>
            <div>Chart: [${it.chart.map(c => c.rap).join(', ')}]</div>
          </div>`
      )
      .join('<hr>');
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

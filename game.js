// Roblox Limiteds - Main Game Simulation Logic

import { items } from './items.js';
import { bots, getBotTradePrice, botShouldTrade } from './bots.js';

export const player = {
  id: 'player',
  name: 'You',
  inventory: [],
  cash: 10000,
  netWorth: 10000,
};

export let leaderboard = [];

function updateLeaderboard() {
  function calcNetWorth(trader) {
    let itemsValue = trader.inventory
      .map(itemId => {
        const itm = items.find(it => it.id === itemId);
        return itm ? itm.rap : 0;
      })
      .reduce((a, b) => a + b, 0);
    return trader.cash + itemsValue;
  }
  leaderboard = [
    { ...player, netWorth: calcNetWorth(player) },
    ...bots.map(bot => ({ ...bot, netWorth: calcNetWorth(bot) })),
  ].sort((a, b) => b.netWorth - a.netWorth);
}

let round = 0;
let interval = null;
const roundInterval = 30000; // 30s, adjust as needed

export function startGame(uiUpdateCallback) {
  round = 0;
  interval = setInterval(() => {
    round++;
    dropNewItem();
    botsTrade();
    expireCirculation();
    updateLeaderboard();
    if (uiUpdateCallback) uiUpdateCallback();
  }, roundInterval);
}

function dropNewItem() {
  // Pick random item with stock left
  const available = items.filter(it => it.stock < it.maxStock);
  if (available.length === 0) return;
  const pick = available[Math.floor(Math.random() * available.length)];
  pick.stock++;
  pick.salesVolume.push(0); // For charting
}

function botsTrade() {
  for (const bot of bots) {
    // Try to buy
    for (const item of items) {
      if (botShouldTrade(item, bot) && item.stock > 0 && bot.cash >= item.rap) {
        const price = getBotTradePrice(item);
        bot.inventory.push(item.id);
        bot.cash -= price;
        item.stock--;
        updateRAP(item, price);
        recordSale(item, price);
      }
    }
    // Try to sell
    for (const itemId of [...bot.inventory]) {
      const item = items.find(it => it.id === itemId);
      if (item && botShouldTrade(item, bot)) {
        const price = getBotTradePrice(item);
        bot.inventory = bot.inventory.filter(id => id !== itemId);
        bot.cash += price;
        item.stock++;
        updateRAP(item, price);
        recordSale(item, price);
      }
    }
  }
}

function expireCirculation() {
  // Placeholder: you can add timestamp logic per inventory item for true expiration
  // Here, simulate by randomly removing some items from inventories
  for (const trader of [player, ...bots]) {
    if (trader.inventory.length === 0) continue;
    if (Math.random() < 0.15) {
      // 15% chance per round per trader to lose a random item
      const idx = Math.floor(Math.random() * trader.inventory.length);
      const [removed] = trader.inventory.splice(idx, 1);
      const itm = items.find(it => it.id === removed);
      if (itm) itm.stock--;
    }
  }
}

function updateRAP(item, price) {
  if (!item.salesVolume) item.salesVolume = [];
  item.salesVolume.push(price);
  if (item.salesVolume.length > 20) item.salesVolume.shift();
  item.rap =
    Math.round(
      item.salesVolume.reduce((a, b) => a + b, 0) / item.salesVolume.length
    ) || item.startingRAP;
}

function recordSale(item, price) {
  if (!item.chart) item.chart = [];
  item.chart.push({ round, rap: item.rap, price });
  if (item.chart.length > 20) item.chart.shift();
}

export function playerBuy(itemId) {
  const item = items.find(it => it.id === itemId);
  if (item && item.stock > 0 && player.cash >= item.rap) {
    player.inventory.push(item.id);
    player.cash -= item.rap;
    item.stock--;
    updateRAP(item, item.rap);
    recordSale(item, item.rap);
    updateLeaderboard();
  }
}

export function playerSell(itemId, customPrice) {
  const idx = player.inventory.indexOf(itemId);
  const item = items.find(it => it.id === itemId);
  if (idx !== -1 && item) {
    player.inventory.splice(idx, 1);
    player.cash += customPrice;
    item.stock++;
    updateRAP(item, customPrice);
    recordSale(item, customPrice);
    updateLeaderboard();
  }
}

export function stopGame() {
  clearInterval(interval);
}

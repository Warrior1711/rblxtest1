// Roblox Limiteds - Bots Definition and Logic
import { items } from './items.js';

export const bots = Array.from({ length: 15 }, (_, i) => ({
  id: `bot${i + 1}`,
  name: `Bot Trader ${i + 1}`,
  inventory: [],
  cash: 10000,
  netWorth: 10000,
}));

export function getBotTradePrice(item) {
  const min = Math.ceil(item.rap * 1.1);
  const max = Math.floor(item.rap * 1.5);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function botShouldTrade(item, bot) {
  if (item.tags.includes('demand') || item.tags.includes('projected')) {
    return Math.random() < 0.7;
  }
  if (item.tags.includes('projected') && bot.inventory.includes(item.id)) {
    return Math.random() < 0.8;
  }
  if (item.tags.includes('rare') && !bot.inventory.includes(item.id)) {
    return Math.random() < 0.6;
  }
  return Math.random() < 0.3;
}

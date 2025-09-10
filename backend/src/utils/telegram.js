import { Telegraf } from "telegraf";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

export default function sendTelegram(telegramChat, message) {
  if (!TELEGRAM_TOKEN || !telegramChat)
    throw new Error(`As configurações do Telegram não estão definidas!`);

  const bot = new Telegraf(TELEGRAM_TOKEN);
  return bot.telegram.sendMessage(telegramChat, message);
}

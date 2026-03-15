export async function sendTelegramMessage(chatId: string | null | undefined, message: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken || !chatId) {
        console.warn("Telegram bot token or chat ID is missing. Notification skipped.")
        return false
    }

    try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML' // Safe for bold formatting
            })
        })

        if (!res.ok) {
            console.error("Telegram API Error:", await res.text())
            return false
        }

        return true
    } catch (error) {
        console.error("Telegram Error:", error)
        return false
    }
}

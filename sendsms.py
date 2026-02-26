from flask import Flask, jsonify
import requests

app = Flask(__name__)

BOT_TOKEN = "8550250238:AAGw95hr2lmhdDvqe0hevgokZocp04_Wlmg"

CHAT_IDS = [
    "5843164141",
    "5878728256",
    "934845091"
]

def send_telegram_alert(message):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    for chat_id in CHAT_IDS:
        data = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        requests.post(url, data=data)

@app.route("/send-alert", methods=["POST"])
def send_alert():
    send_telegram_alert(
        "🚨 <b>FLOOD ALERT</b>\n"
        "Water level high! 92%\n"
        "Take action immediately."
    )
    return jsonify({"status": "Alert sent successfully"})
    
if __name__ == "__main__":
    app.run(debug=True)

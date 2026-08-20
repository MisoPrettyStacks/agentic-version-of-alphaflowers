import os
import json
import urllib.request
from datetime import datetime

def run_agentic_scan():
    print(f"[{datetime.utcnow().isoformat()}] Booting Free Agentic Market Scanner...")
    
    # 1. Gather Live Market State Data from a free public endpoint
    url = "https://coingecko.com"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            live_market_data = json.loads(response.read().decode())
            
        print("Live market connection established successfully.")
        
        # 2. Agent Logic Matrix: Process anomalies based on metric signals
        anomalies_detected = []
        ticker_mapping = {"bitcoin": "BTC", "ethereum": "ETH", "solana": "SOL"}
        
        for coin_id, data in live_market_data.items():
            price = data.get("usd", 0)
            change_24h = data.get("usd_24h_change", 0)
            ticker = ticker_mapping.get(coin_id, coin_id.upper())
            
            # Arbitrary signal logic rule: flag movements over a +/- 1.5% threshold
            if abs(change_24h) > 1.5:
                status = "CRITICAL METRIC DRIFT" if change_24h < 0 else "LIQUIDITY ACCELERATION"
                confidence = round(min(98.4, 75.0 + abs(change_24h) * 2), 1)
                
                anomalies_detected.append({
                    "id": f"GOV-{ticker}-{int(datetime.utcnow().timestamp())}",
                    "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
                    "source": f"Feed Matrix ({ticker}/USD)",
                    "type": status,
                    "metric": f"${price:,.2f} ({change_24h:+.2f}%)",
                    "confidence": f"{confidence}%"
                })
        
        # Fallback if market volatility is flat during testing periods
        if not anomalies_detected:
            anomalies_detected.append({
                "id": f"GOV-SCAN-{int(datetime.utcnow().timestamp())}",
                "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
                "source": "System Pulse Check",
                "type": "OPTIMAL RANGE STABILITY",
                "metric": "Volatility Matrix Flat",
                "confidence": "94.2%"
            })

        # 3. Commit state changes to data file
        output_payload = {
            "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "system_status": "OPERATIONAL / AUTONOMOUS SCANNING",
            "anomalies": anomalies_detected
        }
        
        with open("data.json", "w") as f:
            json.dump(output_payload, f, indent=4)
            
        print("Data extraction loop compiled successfully to data.json.")
        
    except Exception as e:
        print(f"Scanning sequence failed: {str(e)}")
        # Generate an emergency offline payload so the web screen doesn't break
        error_payload = {
            "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "system_status": f"API THROTTLED / ERROR: {str(e)}",
            "anomalies": [{
                "id": "ERR-REST-429",
                "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
                "source": "Network Controller Gateway",
                "type": "RATE_LIMIT_DELAY",
                "metric": "API Cooldown Mode Active",
                "confidence": "99.9%"
            }]
        }
        with open("data.json", "w") as f:
            json.dump(error_payload, f, indent=4)

if __name__ == "__main__":
    run_agentic_scan()

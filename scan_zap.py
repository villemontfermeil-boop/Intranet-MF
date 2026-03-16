import requests
import time
import json

# Configuration
zap_url = "http://localhost:8080"
target = "http://localhost:3000"

def spider_scan():
    print("🕷️ Exploration du site...")
    try:
        r = requests.get(f"{zap_url}/JSON/spider/action/scan/", params={"url": target})
        scan_id = r.json()["scan"]
        
        while True:
            r = requests.get(f"{zap_url}/JSON/spider/view/status/", params={"scanId": scan_id})
            status = r.json()["status"]
            print(f"   Progression: {status}%", end="\r")
            if status == "100":
                break
            time.sleep(2)
        print("\n✅ Exploration terminée !")
        return True
    except Exception as e:
        print(f"❌ Erreur spider: {e}")
        return False

def active_scan():
    print("\n🔍 Scan des vulnérabilités...")
    try:
        r = requests.get(f"{zap_url}/JSON/ascan/action/scan/", params={"url": target})
        scan_id = r.json()["scan"]
        
        while True:
            r = requests.get(f"{zap_url}/JSON/ascan/view/status/", params={"scanId": scan_id})
            status = r.json()["status"]
            print(f"   Progression: {status}%", end="\r")
            if status == "100":
                break
            time.sleep(5)
        print("\n✅ Scan terminé !")
        return True
    except Exception as e:
        print(f"❌ Erreur scan: {e}")
        return False

def get_results():
    print("\n📊 Résultats du scan:")
    try:
        r = requests.get(f"{zap_url}/JSON/alert/view/alerts/", params={"baseurl": target})
        alerts = r.json().get("alerts", [])
        
        if not alerts:
            print("✅ Aucune vulnérabilité trouvée !")
            return
        
        # Compter par risque
        counts = {"High": 0, "Medium": 0, "Low": 0, "Informational": 0}
        for alert in alerts:
            risk = alert.get("risk", "Informational")
            counts[risk] = counts.get(risk, 0) + 1
        
        print("\n" + "="*50)
        print("RÉSUMÉ DES VULNÉRABILITÉS")
        print("="*50)
        for risk, count in counts.items():
            if count > 0:
                if risk == "High":
                    emoji = "🔴"
                elif risk == "Medium":
                    emoji = "🟠"
                elif risk == "Low":
                    emoji = "🟡"
                else:
                    emoji = "🔵"
                print(f"{emoji} {risk}: {count}")
        
        # Détails des plus critiques
        if counts["High"] > 0:
            print("\n🔴 VULNÉRABILITÉS CRITIQUES:")
            for alert in alerts:
                if alert.get("risk") == "High":
                    print(f"   • {alert.get('name')}")
                    print(f"     URL: {alert.get('url')}")
        
        # Sauvegarde
        with open("vulnerabilites.json", "w", encoding="utf-8") as f:
            json.dump(alerts, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Rapport complet sauvegardé dans vulnerabilites.json")
        
    except Exception as e:
        print(f"❌ Erreur récupération résultats: {e}")

# Test de connexion d'abord
print("🚀 DÉMARRAGE DU SCAN DE SÉCURITÉ")
print(f"📍 Cible: {target}")
print(f"🔌 ZAP: {zap_url}")

try:
    r = requests.get(f"{zap_url}/JSON/core/view/version/", timeout=5)
    if r.status_code == 200:
        version = r.json().get("version", "inconnue")
        print(f"✅ Connecté à ZAP version {version}")
        
        if spider_scan():
            if active_scan():
                get_results()
        print("\n✨ Scan terminé !")
    else:
        print(f"❌ Erreur de connexion à ZAP: {r.status_code}")
except Exception as e:
    print(f"❌ ZAP ne répond pas: {e}")
    print("   Vérifiez que ZAP est lancé avec: .\\ZAP.exe -daemon -port 8080 -config api.disablekey=true")

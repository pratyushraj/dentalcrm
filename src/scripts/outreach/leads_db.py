import sqlite3
import os
import re
import subprocess
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dental_leads_master.db")

JSON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "leads_data.json")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def sync_from_json_if_needed():
    """Seed SQLite database from leads_data.json if DB does not exist or has 0 rows."""
    if not os.path.exists(JSON_PATH):
        return
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT count(*) FROM leads")
    count = c.fetchone()[0]
    if count == 0:
        import json
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            leads = json.load(f)
        for lead in leads:
            c.execute("""
            INSERT OR IGNORE INTO leads (id, clinic_name, doctor_name, email, city, state, specialty, source, status, resend_id, created_at, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lead.get("id"),
                lead.get("clinic_name"),
                lead.get("doctor_name"),
                lead.get("email"),
                lead.get("city"),
                lead.get("state"),
                lead.get("specialty"),
                lead.get("source"),
                lead.get("status", "pending"),
                lead.get("resend_id"),
                lead.get("created_at"),
                lead.get("sent_at")
            ))
        conn.commit()
    conn.close()

def export_db_to_json():
    """Export current SQLite state to leads_data.json so git tracks it."""
    import json
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM leads ORDER BY id ASC")
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2, ensure_ascii=False)

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clinic_name TEXT NOT NULL,
        doctor_name TEXT,
        email TEXT UNIQUE NOT NULL,
        city TEXT,
        state TEXT,
        specialty TEXT,
        source TEXT,
        status TEXT DEFAULT 'pending', -- pending, sent, bounced, opt_out, invalid_mailbox
        resend_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sent_at TIMESTAMP
    )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)")
    conn.commit()
    conn.close()
    sync_from_json_if_needed()

def is_valid_email(email):
    if not email:
        return False
    email = email.strip().lower()
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))

def insert_lead(clinic_name, doctor_name, email, city="", state="", specialty="", source="web_scraper", status="pending"):
    if not is_valid_email(email):
        return False
    
    email = email.strip().lower()
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        INSERT INTO leads (clinic_name, doctor_name, email, city, state, specialty, source, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
            clinic_name = COALESCE(NULLIF(excluded.clinic_name, ''), leads.clinic_name),
            doctor_name = COALESCE(NULLIF(excluded.doctor_name, ''), leads.doctor_name),
            city = COALESCE(NULLIF(excluded.city, ''), leads.city),
            state = COALESCE(NULLIF(excluded.state, ''), leads.state),
            specialty = COALESCE(NULLIF(excluded.specialty, ''), leads.specialty)
        """, (clinic_name, doctor_name, email, city, state, specialty, source, status))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error inserting {email}: {e}")
        return False
    finally:
        conn.close()

def get_pending_leads(limit=100):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM leads 
    WHERE status = 'pending' 
    ORDER BY id ASC 
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def mark_lead_sent(lead_id, resend_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE leads 
    SET status = 'sent', resend_id = ?, sent_at = CURRENT_TIMESTAMP 
    WHERE id = ?
    """, (resend_id, lead_id))
    conn.commit()
    conn.close()

def mark_lead_failed(lead_id, status="failed"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE leads 
    SET status = ? 
    WHERE id = ?
    """, (status, lead_id))
    conn.commit()
    conn.close()

def get_db_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT status, COUNT(*) as cnt FROM leads GROUP BY status")
    stats = {row["status"]: row["cnt"] for row in cursor.fetchall()}
    cursor.execute("SELECT COUNT(*) as total FROM leads")
    total = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(DISTINCT city) as total_cities FROM leads WHERE city != ''")
    cities = cursor.fetchone()["total_cities"]
    conn.close()
    return {"total": total, "cities": cities, "breakdown": stats}

if __name__ == "__main__":
    import sys
    init_db()
    if "--stats" in sys.argv:
        stats = get_db_stats()
        print(f"--- Clinaza Dental Leads Database Stats ---")
        print(f"Total Leads: {stats['total']}")
        print(f"Unique Cities: {stats['cities']}")
        print(f"Status Breakdown: {stats['breakdown']}")
    else:
        print("Database initialized successfully at:", DB_PATH)

import sqlite3
import os
import re
import subprocess
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dental_leads_master.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

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
        status TEXT DEFAULT 'pending', -- pending, sent, bounced, opt_out
        resend_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sent_at TIMESTAMP
    )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)")
    conn.commit()
    conn.close()

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

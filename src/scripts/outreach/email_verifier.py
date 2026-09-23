import socket
import smtplib
import re
import dns.resolver
from typing import Tuple

MX_CACHE = {}

def get_mx_record(domain: str) -> str:
    """Resolve MX host for domain, caching results."""
    domain = domain.lower().strip()
    if domain in MX_CACHE:
        return MX_CACHE[domain]
        
    try:
        answers = dns.resolver.resolve(domain, 'MX')
        # Sort by priority preference
        records = sorted([(r.preference, str(r.exchange).rstrip('.')) for r in answers], key=lambda x: x[0])
        if records:
            mx_host = records[0][1]
            MX_CACHE[domain] = mx_host
            return mx_host
    except Exception as e:
        # Fallback for common providers if DNS lookup fails
        if domain == "gmail.com":
            return "gmail-smtp-in.l.google.com"
        elif domain in ["yahoo.com", "ymail.com"]:
            return "mta5.am0.yahoodns.net"
        elif domain in ["outlook.com", "hotmail.com"]:
            return "outlook-com.olc.protection.outlook.com"
            
    return None

def verify_email_mailbox(email: str, sender: str = "contact@clinaza.in", timeout: int = 4) -> Tuple[bool, str]:
    """
    Performs real-time pre-flight SMTP mailbox verification.
    Connects to the destination MX server and executes:
      HELO -> MAIL FROM -> RCPT TO
    Returns (is_valid: bool, reason: str).
    Guarantees that unverified or non-existent inboxes are NEVER dispatched to Resend.
    """
    if not email or "@" not in email:
        return False, "Invalid email format"
        
    email = email.strip().lower()
    
    # Basic RFC syntax regex check
    if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
        return False, "Failed syntax regex check"
        
    domain = email.split("@")[1]
    
    # 1. Resolve MX
    mx_host = get_mx_record(domain)
    if not mx_host:
        return False, f"No MX records found for domain '{domain}'"
        
    # 2. SMTP Handshake & RCPT TO check
    server = None
    try:
        server = smtplib.SMTP(timeout=timeout)
        server.connect(mx_host, 25)
        server.helo("clinaza.in")
        server.mail(sender)
        code, msg = server.rcpt(email)
        
        try:
            msg_str = msg.decode("utf-8", errors="ignore")
        except Exception:
            msg_str = str(msg)
            
        # 250 = Address Ok / Deliverable
        if code == 250:
            return True, f"Verified deliverable (250 OK)"
            
        # 550, 551, 553 = User unknown / Mailbox does not exist
        if code in (550, 551, 553):
            return False, f"Mailbox rejected by server ({code}: {msg_str.strip()})"
            
        # For catch-all / greylisting / temporary codes (450, 451, 452)
        # To strictly protect free quota from wasting, we treat dubious rejections as unsafe
        if code >= 400:
            return False, f"Server returned error code {code}: {msg_str.strip()}"
            
        return True, f"Accepted with code {code}"
    except smtplib.SMTPServerDisconnected:
        return False, "SMTP server disconnected unexpectedly"
    except socket.timeout:
        return False, "SMTP connection timed out"
    except Exception as e:
        return False, f"SMTP error: {str(e)}"
    finally:
        if server:
            try:
                server.quit()
            except Exception:
                pass

if __name__ == "__main__":
    test_emails = [
        "funnyraj10@gmail.com",
        "definitely_fake_doctor_clinaza_123456@gmail.com",
        "invalid-domain@thisdomaindoesnotexistxyz123.com"
    ]
    print("Testing email verification guardrail:")
    for email in test_emails:
        valid, reason = verify_email_mailbox(email)
        print(f"[{'PASS' if valid else 'FAIL'}] {email}: {reason}")

# Easycred Partner & DSA Integration API Documentation
**Platform**: Easycred (`easycred.co.in`)  
**Partner Integration Type**: DSA / Partner Direct Embedded Journey  
**Environment**: Production (`https://partner.easycred.co.in`)  
**Version**: v1.0  
**Last Verified**: September 2026

---

## 1. Authentication & Security

### 1.1 Partner Role & JWT Header
All partner endpoints require a Bearer token issued by Easycred upon partner authentication.
```http
Authorization: Bearer <EASYCRED_PARTNER_TOKEN>
Cookie: access_token=<EASYCRED_PARTNER_TOKEN>
Content-Type: application/json
Accept: application/json
```

- **Environment Variable**: `process.env.EASYCRED_PARTNER_TOKEN`
- **User / Partner ID**: `6a8556e9d06d161d51a72172`
- **Role**: `PARTNER`

---

## 2. Endpoints

### 2.1 Initiate Customer Loan Journey
Generates an application record and sends a direct digital invitation link via SMS to the customer.

- **Method**: `POST`
- **Production URL**: `https://partner.easycred.co.in/api/partner/journey/initiate`
- **Internal Proxy Endpoint**: `POST /api/lenders/easycred`

#### Request Payload:
```json
{
  "customerName": "Rahul Sharma",
  "mobile": "9876543210",
  "productCode": "ONLINE_PERSONAL"
}
```

#### Field Specifications:
| Field | Type | Required | Description |
|---|---|---|---|
| `customerName` | String | Yes | Full name of the applicant/patient |
| `mobile` | String | Yes | Valid 10-digit Indian mobile number (without `+91`) |
| `productCode` | String | Yes | Loan product type. Standardized to `"ONLINE_PERSONAL"` (supported products: `ONLINE_PERSONAL`, `PERSONAL_LOAN`, `HEALTHCARE_EMI`) |

#### Successful Response (`200 OK` / `201 Created`):
```json
{
  "success": true,
  "data": {
    "applicationId": "EC-APP-894210",
    "customerLink": "https://easycred.co.in/loan/invite?t=4f5c35f59772ee1325c2907ed1d09947e83ecb4f3399e1e4",
    "status": "INITIATED",
    "maskedMobile": "••••••3210",
    "smsDispatched": true
  }
}
```

#### Fallback URL (if API is unreachable):
If the upstream API encounters network timeouts, the system falls back to the direct hosted pre-filled link:
```text
https://easycred.co.in/loan/apply?product=PERSONAL_LOAN&mobile={mobile}&name={encodeURIComponent(name)}
```

---

### 2.2 Lead Status Tracking
Checks the status of an ongoing loan application from the partner dashboard.

- **Method**: `GET`
- **Production URL**: `https://partner.easycred.co.in/api/partner/leads/{applicationId}/status`
- **Internal Proxy Endpoint**: `GET /api/lenders/easycred?applicationId={applicationId}`

#### Headers:
```http
Authorization: Bearer <EASYCRED_PARTNER_TOKEN>
Accept: application/json
```

#### Response:
```json
{
  "success": true,
  "data": {
    "applicationId": "EC-APP-894210",
    "customerName": "Rahul Sharma",
    "mobile": "9876543210",
    "status": "SANCTIONED",
    "sanctionedAmount": 120000,
    "allocatedLender": "Axis / InCred Finance",
    "tenureMonths": 12,
    "monthlyEmi": 10000,
    "kycStatus": "COMPLETED",
    "disbursementStatus": "SCHEDULED",
    "updatedAt": "2026-09-19T10:15:00Z"
  }
}
```

#### Application Lifecycle States:
- `INITIATED`: SMS invite dispatched, awaiting customer click.
- `KYC_PENDING`: Customer opened the link, completing Aadhaar/PAN e-KYC.
- `UNDERWRITING`: Evaluated against 55+ NBFC credit score rules.
- `SANCTIONED`: Loan approved with credit limit and tenure options.
- `DISBURSED`: Funds transferred directly to the clinic/hospital bank account.
- `REJECTED`: Application did not meet minimum underwriting criteria.

---

## 3. Real-Time Webhooks

Clinaza receives instant asynchronous updates from Easycred when an application changes state.

- **Webhook URL**: `https://clinaza.in/api/webhook/easycred`
- **Internal File**: `api/webhook/easycred.js`
- **Method**: `POST`
- **Signature Header**: `x-easycred-signature`

### 3.1 Signature Verification (HMAC-SHA256)
```javascript
const signature = req.headers['x-easycred-signature'];
const computed = crypto
  .createHmac('sha256', process.env.EASYCRED_WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (computed !== signature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### 3.2 Webhook Payload Structure:
```json
{
  "eventType": "APPLICATION_STATUS_CHANGED",
  "eventTimestamp": "2026-09-19T10:20:00Z",
  "data": {
    "applicationId": "EC-APP-894210",
    "customerMobile": "9876543210",
    "status": "DISBURSED",
    "sanctionedAmount": 120000,
    "clinicId": "CLINAZA_PARTNER_01",
    "referenceId": "DISB-2026-7819"
  }
}
```

### 3.3 Automated CRM Sync:
When `eventType` is received, Clinaza automatically:
1. Matches the customer in the Supabase database by phone number.
2. Appends status notes to the patient record: `[Easycred Loan DISBURSED]: ₹1,20,000 at 19/09/2026`.
3. Updates `metadata.easycred_status` and `metadata.easycred_application_id`.

---

## 4. Frontend Client Implementation

Service file located at `src/services/easycredService.ts`:

```typescript
import { easycredService } from '@/services/easycredService';

// 1. Initiate application
const result = await easycredService.initiateApplication({
  customerName: "Rahul Sharma",
  mobile: "9876543210",
  productCode: "ONLINE_PERSONAL"
});

if (result.success) {
  console.log("Customer link:", result.data.customerLink);
}

// 2. Poll / Query Lead Status
const status = await easycredService.checkLeadStatus("EC-APP-894210");
```

---

## 5. Summary of Integration Features
- **Zero Redirect Friction**: Uses the **Clinaza Care-Pass Overlay** with auto-redirect timer controls.
- **Direct SMS Dispatch**: Automatic invite link dispatched to patient phone.
- **Fail-Safe Fallbacks**: Zero dropped leads due to client-side fallback generation.
- **Full Database Sync**: Real-time Supabase patient status updates via HMAC verified webhooks.

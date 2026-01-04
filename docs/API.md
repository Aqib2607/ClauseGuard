# ClauseGuard API Documentation

## Base URL

```
http://localhost:3001/api (development)
https://api.clauseguard.com/api (production)
```

## Authentication

Phase 1 does not require authentication. All endpoints are publicly accessible but rate-limited.

## Rate Limiting

- **Free Tier**: 5 requests per minute per IP
- **Upload Endpoints**: 3 requests per minute per IP

Rate limit headers are included in responses:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time when limit resets

---

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response 200**
```json
{
  "status": "ok",
  "timestamp": "2024-01-04T12:00:00.000Z"
}
```

---

### Contract Analysis

#### POST /v1/contracts/analyze

Upload a contract for AI-powered analysis.

**Request**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `contract` (file): Contract file (PDF, DOCX, DOC, or TXT, max 10MB)

**Response 202 (Accepted)**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "pending",
  "message": "Contract uploaded successfully and is being analyzed"
}
```

**Error Responses**

400 Bad Request
```json
{
  "error": "Error",
  "message": "No file uploaded",
  "statusCode": 400
}
```

429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "You have exceeded the 3 requests in 60 seconds limit. Please try again later.",
  "statusCode": 429
}
```

---

#### GET /v1/contracts/analyze/:jobId

Retrieve analysis status and results. Poll this endpoint every 2 seconds until status is "completed" or "failed".

**Request**

- Method: `GET`
- URL Parameters:
  - `jobId` (string, required): Job ID returned from upload

**Response 200 (Pending)**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "pending",
  "fileName": "freelance-contract.pdf"
}
```

**Response 200 (Processing)**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "processing",
  "fileName": "freelance-contract.pdf"
}
```

**Response 200 (Completed)**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "completed",
  "fileName": "freelance-contract.pdf",
  "summary": [
    "Freelance web development agreement for a 3-month project",
    "Payment terms: 50% upfront, 50% on completion, net 30 days",
    "Client retains all intellectual property rights",
    "Standard confidentiality and non-compete clauses included",
    "Overall assessment: Slightly favors client, reasonable for typical freelance work"
  ],
  "riskClauses": [
    {
      "text": "The Client shall have exclusive ownership of all intellectual property created during the engagement.",
      "riskLevel": "medium",
      "explanation": "This clause transfers all IP rights to the client, which is standard but may limit your ability to reuse code or designs in future projects.",
      "section": "Intellectual Property"
    },
    {
      "text": "Payment for completed work shall be made within 60 days of invoice submission.",
      "riskLevel": "high",
      "explanation": "60-day payment terms are unusually long and could create cash flow issues. Industry standard is typically 30 days or less.",
      "section": "Payment Terms"
    }
  ],
  "completedAt": "2024-01-04T12:05:30.000Z"
}
```

**Response 200 (Failed)**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "failed",
  "fileName": "freelance-contract.pdf",
  "errorMessage": "Failed to extract text from file"
}
```

**Error Responses**

404 Not Found
```json
{
  "error": "Error",
  "message": "Job not found",
  "statusCode": 404
}
```

---

#### POST /v1/contracts/:jobId/export

Export analysis results to PDF.

**Request**

- Method: `POST`
- URL Parameters:
  - `jobId` (string, required): Job ID of completed analysis

**Response 200**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="analysis-{jobId}.pdf"`
- Body: PDF file binary

**Error Responses**

404 Not Found
```json
{
  "error": "Error",
  "message": "Job not found",
  "statusCode": 404
}
```

400 Bad Request
```json
{
  "error": "Error",
  "message": "Analysis not completed yet",
  "statusCode": 400
}
```

---

#### POST /v1/contracts/:jobId/email

Capture user email for marketing purposes.

**Request**

- Method: `POST`
- URL Parameters:
  - `jobId` (string, required): Job ID
- Body:
```json
{
  "email": "user@example.com"
}
```

**Response 200**
```json
{
  "message": "Email captured successfully"
}
```

**Error Responses**

400 Bad Request
```json
{
  "error": "Error",
  "message": "Valid email is required",
  "statusCode": 400
}
```

404 Not Found
```json
{
  "error": "Error",
  "message": "Job not found",
  "statusCode": 404
}
```

---

### Contract Generation (Phase 2)

#### POST /v1/contracts/generate

Generate a contract from a template (not fully implemented in Phase 1).

**Request**

- Method: `POST`
- Body:
```json
{
  "templateType": "freelance-agreement",
  "clientName": "Acme Corp",
  "freelancerName": "John Doe",
  "projectDescription": "Website redesign",
  "paymentAmount": "$5,000",
  "paymentTerms": "50% upfront, 50% on completion"
}
```

**Response 202**
```json
{
  "jobId": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
  "status": "pending",
  "message": "Contract generation started"
}
```

---

#### GET /v1/contracts/generate/:jobId

Retrieve generated contract status and text.

**Request**

- Method: `GET`
- URL Parameters:
  - `jobId` (string, required): Job ID from generation request

**Response 200 (Completed)**
```json
{
  "jobId": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
  "status": "completed",
  "templateType": "freelance-agreement",
  "generatedText": "FREELANCE SERVICES AGREEMENT\n\n...",
  "completedAt": "2024-01-04T12:05:30.000Z"
}
```

---

## Data Models

### Risk Clause

```typescript
{
  text: string;           // Exact clause text from contract
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;    // Plain-English explanation
  section?: string;       // Optional section name
}
```

### Job Status

```typescript
type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "statusCode": 400
}
```

### Common Error Codes

- **400**: Bad Request - Invalid input
- **404**: Not Found - Resource doesn't exist
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server-side error

---

## Usage Example (JavaScript)

```javascript
// Upload contract
const formData = new FormData();
formData.append('contract', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:3001/api/v1/contracts/analyze', {
  method: 'POST',
  body: formData,
});

const { jobId } = await uploadResponse.json();

// Poll for results
const pollInterval = setInterval(async () => {
  const statusResponse = await fetch(
    `http://localhost:3001/api/v1/contracts/analyze/${jobId}`
  );
  const result = await statusResponse.json();

  if (result.status === 'completed') {
    clearInterval(pollInterval);
    console.log('Analysis complete:', result);
  } else if (result.status === 'failed') {
    clearInterval(pollInterval);
    console.error('Analysis failed:', result.errorMessage);
  }
}, 2000);

// Export to PDF
const exportResponse = await fetch(
  `http://localhost:3001/api/v1/contracts/${jobId}/export`,
  { method: 'POST' }
);
const blob = await exportResponse.blob();
// Download blob as PDF file

// Capture email
await fetch(`http://localhost:3001/api/v1/contracts/${jobId}/email`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
});
```

---

## CORS

The API is configured to accept requests from:
- `http://localhost:3000` (development)
- Your production frontend domain (production)

Credentials are supported for future authentication features.

---

## Webhooks (Future)

Webhook support for job completion notifications will be added in Phase 2.

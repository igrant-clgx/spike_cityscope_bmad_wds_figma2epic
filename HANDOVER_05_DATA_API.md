# Spike Reno Calculator - Data & API Contracts

**Document Version**: 1.0  
**Date**: August 12, 2026  
**Status**: Ready for Development  
**Format**: JSON/REST API

---

## Table of Contents

1. [Data Model & Schema](#data-model--schema)
2. [Address Validation API](#address-validation-api)
3. [Cost Estimation API](#cost-estimation-api)
4. [Lead Capture API](#lead-capture-api)
5. [Configuration & Lookup APIs](#configuration--lookup-apis)
6. [Error Handling](#error-handling)
7. [Authentication & Security](#authentication--security)

---

## Data Model & Schema

### Form State Model

Represents the complete state of a renovation estimate:

```typescript
interface RenovationEstimateForm {
  id?: string;                          // Unique identifier (UUID)
  address: {
    full: string;                       // e.g., "400 Catherine Street, Lilyfield NSW 2040"
    streetNumber?: string;              // e.g., "400"
    street?: string;                    // e.g., "Catherine Street"
    suburb?: string;                    // e.g., "Lilyfield"
    state?: string;                     // e.g., "NSW"
    postcode?: string;                  // e.g., "2040"
    country?: string;                   // e.g., "AU"
    latitude?: number;
    longitude?: number;
    googlePlaceId?: string;             // For reference
  };
  
  renovation: {
    type: 'internal' | 'external';      // Binary choice from Step 1
    items: string[];                    // IDs of selected items from Step 2
                                        // e.g., ["kitchen", "bathroom", "flooring"]
  };
  
  details: {
    propertyType?: 'house' | 'apartment' | 'townhouse' | 'other';
    propertyAge?: number;               // Years (e.g., 1950)
    propertySize?: number;              // Square meters
    currentCondition?: number;          // 1-5 scale (poor to excellent)
    targetStartDate?: string;           // ISO date format: "2025-01-15"
    budget?: {
      min: number;                      // AUD
      max: number;                      // AUD
    };
  };
  
  timestamp: {
    created: string;                    // ISO timestamp
    modified: string;                   // ISO timestamp
    completed?: string;                 // ISO timestamp when estimate generated
  };
  
  estimate?: {
    costMin: number;                    // AUD
    costMax: number;                    // AUD
    confidence?: number;                // 0-100 (estimate reliability)
    calculationMethod?: string;         // For logging/analysis
  };
}
```

### Available Renovation Items (Step 2)

These are the options available for selection after Step 1 choice:

#### Internal Renovations
```json
{
  "items": [
    {
      "id": "kitchen",
      "label": "Kitchen",
      "category": "internal",
      "avgCostMin": 15000,
      "avgCostMax": 50000,
      "estimatedDuration": "4-8 weeks"
    },
    {
      "id": "bathroom",
      "label": "Bathroom",
      "category": "internal",
      "avgCostMin": 8000,
      "avgCostMax": 30000,
      "estimatedDuration": "2-4 weeks"
    },
    {
      "id": "flooring",
      "label": "Flooring",
      "category": "internal",
      "avgCostMin": 5000,
      "avgCostMax": 15000,
      "estimatedDuration": "1-2 weeks"
    },
    {
      "id": "walls",
      "label": "Walls & Painting",
      "category": "internal",
      "avgCostMin": 3000,
      "avgCostMax": 10000,
      "estimatedDuration": "1 week"
    },
    {
      "id": "lighting",
      "label": "Lighting & Electrical",
      "category": "internal",
      "avgCostMin": 4000,
      "avgCostMax": 12000,
      "estimatedDuration": "1-2 weeks"
    },
    {
      "id": "plumbing",
      "label": "Plumbing & Fixtures",
      "category": "internal",
      "avgCostMin": 3000,
      "avgCostMax": 10000,
      "estimatedDuration": "1 week"
    }
  ]
}
```

#### External Renovations
```json
{
  "items": [
    {
      "id": "roof",
      "label": "Roof & Guttering",
      "category": "external",
      "avgCostMin": 10000,
      "avgCostMax": 40000,
      "estimatedDuration": "2-3 weeks"
    },
    {
      "id": "windows",
      "label": "Windows & Doors",
      "category": "external",
      "avgCostMin": 8000,
      "avgCostMax": 25000,
      "estimatedDuration": "1-2 weeks"
    },
    {
      "id": "exterior",
      "label": "Exterior Walls & Cladding",
      "category": "external",
      "avgCostMin": 15000,
      "avgCostMax": 50000,
      "estimatedDuration": "3-4 weeks"
    },
    {
      "id": "landscaping",
      "label": "Landscaping & Outdoor",
      "category": "external",
      "avgCostMin": 5000,
      "avgCostMax": 20000,
      "estimatedDuration": "1-2 weeks"
    },
    {
      "id": "decking",
      "label": "Decking & Patio",
      "category": "external",
      "avgCostMin": 8000,
      "avgCostMax": 30000,
      "estimatedDuration": "2-3 weeks"
    }
  ]
}
```

---

## Address Validation API

### Endpoint

```
GET /api/v1/address/validate
GET /api/v1/address/autocomplete
```

### Request (Autocomplete)

```http
GET /api/v1/address/autocomplete?input=400%20Catherine&country=AU&language=en

Query Parameters:
- input (required): User's address input string
- country (required): Country code (e.g., "AU")
- language (optional): "en" (default)
- components (optional): Restrict to state/territory ("administrativeArea:NSW")
```

### Response (Success)

```json
{
  "success": true,
  "predictions": [
    {
      "placeId": "ChIJd8BlEFBuEmsR...",
      "mainText": "400 Catherine Street",
      "secondaryText": "Lilyfield NSW 2040, Australia",
      "fullText": "400 Catherine Street, Lilyfield NSW 2040, Australia",
      "address": {
        "streetNumber": "400",
        "street": "Catherine Street",
        "suburb": "Lilyfield",
        "state": "NSW",
        "postcode": "2040",
        "country": "AU"
      }
    },
    {
      "placeId": "ChIJa8BlEFBuEmsR...",
      "mainText": "400 Catherine Road",
      "secondaryText": "Pennant Hills NSW 2120, Australia",
      "fullText": "400 Catherine Road, Pennant Hills NSW 2120, Australia",
      "address": {
        "streetNumber": "400",
        "street": "Catherine Road",
        "suburb": "Pennant Hills",
        "state": "NSW",
        "postcode": "2120",
        "country": "AU"
      }
    }
  ],
  "timestamp": "2026-08-12T10:30:00Z"
}
```

### Address Details Request

```http
GET /api/v1/address/details?placeId=ChIJd8BlEFBuEmsR...
```

### Response (Detailed Address)

```json
{
  "success": true,
  "address": {
    "placeId": "ChIJd8BlEFBuEmsR...",
    "fullAddress": "400 Catherine Street, Lilyfield NSW 2040, Australia",
    "components": {
      "streetNumber": "400",
      "street": "Catherine Street",
      "suburb": "Lilyfield",
      "state": "NSW",
      "postcode": "2040",
      "country": "Australia",
      "countryCode": "AU"
    },
    "geometry": {
      "lat": -33.8688,
      "lng": 151.1193
    },
    "validated": true,
    "confidence": "high"
  }
}
```

### Response (Error)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "Address could not be validated",
    "details": "No results found for the given input"
  }
}
```

### Implementation Notes

- **API Suggested**: Google Places API (Google Maps) or Australia Post Address API
- **Rate Limiting**: Implement request throttling (debounce input, max 1 request/300ms)
- **Caching**: Cache recent searches locally for 1 hour
- **Fallback**: Allow manual address entry if API fails

---

## Cost Estimation API

### Endpoint

```
POST /api/v1/estimate/calculate
```

### Request

```http
POST /api/v1/estimate/calculate
Content-Type: application/json

{
  "address": {
    "postcode": "2040",
    "suburb": "Lilyfield",
    "state": "NSW"
  },
  "renovation": {
    "type": "internal",
    "items": ["kitchen", "bathroom"]
  },
  "details": {
    "propertyType": "house",
    "propertyAge": 1995,
    "propertySize": 150,
    "currentCondition": 2,
    "targetStartDate": "2025-06-01",
    "budget": {
      "min": 50000,
      "max": 100000
    }
  }
}
```

### Request Validation

```
Required fields:
- address.postcode
- renovation.type
- renovation.items (at least 1)

Optional fields:
- details.propertyType
- details.propertyAge
- details.propertySize
- details.currentCondition
- details.targetStartDate
- details.budget
```

### Response (Success)

```json
{
  "success": true,
  "estimate": {
    "id": "est_2026_08_12_a1b2c3d4",
    "costMin": 32700,
    "costMax": 40000,
    "currency": "AUD",
    "confidence": 75,
    "breakdown": {
      "kitchen": {
        "costMin": 15000,
        "costMax": 25000,
        "proportion": 0.55
      },
      "bathroom": {
        "costMin": 8000,
        "costMax": 12000,
        "proportion": 0.28
      },
      "other": {
        "costMin": 3000,
        "costMax": 5000,
        "proportion": 0.12
      }
    },
    "factors": {
      "location": "metropolitan",
      "postcode": "2040",
      "propertyAge": 1995,
      "condition": "Fair",
      "marketTrend": "stable"
    },
    "disclaimer": "These are estimates based on market data and may not reflect actual costs. Consult a contractor for accurate quotes.",
    "timestamp": "2026-08-12T10:30:00Z"
  }
}
```

### Response (Error)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Cost estimation failed",
    "details": "Invalid renovation type specified"
  }
}
```

### Calculation Logic (Example)

**Pseudocode**:
```
baseCost = sum(avgCostMin for selected items)
highCost = sum(avgCostMax for selected items)

// Apply location multiplier (postcode-based)
multiplier = getLocationMultiplier(postcode)
baseCost *= multiplier
highCost *= multiplier

// Apply property age factor
if propertyAge > 50:
  factor = 1.15  // Older homes cost more
else:
  factor = 1.0

baseCost *= factor
highCost *= factor

// Apply condition factor
switch(condition):
  case 1: factor = 1.2  // Poor
  case 2: factor = 1.1  // Fair
  case 3: factor = 1.0  // Good
  case 4: factor = 0.95 // Excellent
  case 5: factor = 0.9  // Like new

baseCost *= factor
highCost *= factor

// Confidence score based on completeness
confidence = 50 + (fields_provided / total_optional_fields) * 50

return { costMin: baseCost, costMax: highCost, confidence }
```

---

## Lead Capture API

### Endpoint

```
POST /api/v1/leads/capture
```

### Request

```http
POST /api/v1/leads/capture
Content-Type: application/json

{
  "estimateId": "est_2026_08_12_a1b2c3d4",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "+61412345678"
  },
  "address": {
    "full": "400 Catherine Street, Lilyfield NSW 2040",
    "postcode": "2040",
    "suburb": "Lilyfield",
    "state": "NSW"
  },
  "renovation": {
    "type": "internal",
    "items": ["kitchen", "bathroom"],
    "estimatedBudget": 75000
  },
  "preferences": {
    "contactMethod": "phone",  // "phone" | "email"
    "bestTimeToContact": "morning",  // "morning" | "afternoon" | "evening"
    "consentToMarketing": true
  },
  "source": {
    "referrer": "demo.channel.com",
    "campaign": "home-loan-coach",
    "utm_source": "organic"
  }
}
```

### Request Validation

```
Required fields:
- personalInfo.firstName
- personalInfo.lastName
- personalInfo.email
- personalInfo.phone
- address.postcode
- preferences.contactMethod

Validation rules:
- email: Valid email format
- phone: Valid AU phone number
- firstName/lastName: Non-empty, >= 2 chars
- postcode: Valid AU postcode
```

### Response (Success)

```json
{
  "success": true,
  "lead": {
    "id": "lead_2026_08_12_x9y8z7w6",
    "estimateId": "est_2026_08_12_a1b2c3d4",
    "status": "new",
    "createdAt": "2026-08-12T10:35:00Z",
    "assignedTo": "home-loan-coach-team",
    "nextFollowUpAt": "2026-08-12T11:00:00Z"
  },
  "message": "Lead captured successfully. A home loan coach will contact you soon."
}
```

### Response (Error)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Lead capture failed",
    "details": "Invalid email format",
    "fields": {
      "email": ["Invalid email format"]
    }
  }
}
```

### Post-Submission Flow

1. **Lead saved to CRM** (Salesforce, HubSpot, or custom database)
2. **Auto-reply email sent** to user with:
   - Confirmation of estimate details
   - Expected follow-up time
   - Contact information for home loan coach
3. **Notification to sales team** with lead details
4. **CRM workflow triggered** for follow-up sequence

---

## Configuration & Lookup APIs

### Get Renovation Items (Step 2 Options)

```http
GET /api/v1/config/renovation-items?type=internal

Query Parameters:
- type (required): "internal" or "external"
```

**Response**:
```json
{
  "success": true,
  "items": [
    { "id": "kitchen", "label": "Kitchen", "avgCostMin": 15000, "avgCostMax": 50000 },
    { "id": "bathroom", "label": "Bathroom", "avgCostMin": 8000, "avgCostMax": 30000 }
  ]
}
```

### Get Step 3 Questions

```http
GET /api/v1/config/step3-questions
```

**Response**:
```json
{
  "success": true,
  "questions": [
    {
      "id": "propertyType",
      "type": "radio",
      "label": "What type of property are you renovating?",
      "required": true,
      "options": [
        { "id": "house", "label": "House" },
        { "id": "apartment", "label": "Apartment" },
        { "id": "townhouse", "label": "Townhouse" }
      ]
    },
    {
      "id": "propertyAge",
      "type": "text",
      "label": "What year was your property built?",
      "required": false,
      "placeholder": "e.g., 1995"
    }
  ]
}
```

### Get Location Multipliers

```http
GET /api/v1/config/location-multiplier?postcode=2040
```

**Response**:
```json
{
  "success": true,
  "postcode": "2040",
  "suburb": "Lilyfield",
  "state": "NSW",
  "multiplier": 1.05,
  "region": "Sydney Metropolitan",
  "costLevel": "medium-high"
}
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Successful API call |
| 400 | Bad Request | Invalid JSON, missing required fields |
| 401 | Unauthorized | Missing/invalid API key |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Server maintenance |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": "Additional context (if available)",
    "fields": {
      "fieldName": ["error 1", "error 2"]
    }
  },
  "requestId": "req_2026_08_12_abc123",
  "timestamp": "2026-08-12T10:35:00Z"
}
```

### Client-Side Error Handling

```javascript
// Retry logic for transient errors
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response.json();
      }
      
      if (response.status === 429 || response.status >= 500) {
        // Retry transient errors
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Non-retryable error
      throw new Error(`API Error: ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

---

## Authentication & Security

### API Key Authentication

```http
GET /api/v1/address/validate?input=...
Authorization: Bearer sk_live_abc123def456

X-API-Key: sk_live_abc123def456  (Alternative header)
```

### CORS Configuration

```
Allowed Origins: *.demo.channel.com, localhost:3000 (dev)
Allowed Methods: GET, POST, PUT
Allowed Headers: Content-Type, Authorization
Max Age: 86400 (24 hours)
```

### Rate Limiting

```
- Address validation: 100 req/minute per API key
- Cost estimation: 50 req/minute per API key
- Lead capture: 20 req/minute per API key
- Burst limit: +50% for 10 seconds
```

### Data Security

```
- HTTPS only (TLS 1.2+)
- No PII logged to console
- Sensitive fields masked in logs
- Request IDs for traceability
- Timeout: 30 seconds per request
```

### PII Handling

```
- Lead data: Encrypted in transit and at rest
- Address: Geo-coordinates stored separately
- Phone: Masked in logs (****5678)
- Email: Hashed for lookups, plaintext in CRM
- Retention: 24 months per Australian Privacy Act
```

---

## Example Implementation

### Frontend (React)

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
  },
  timeout: 30000
});

// Address validation
export const validateAddress = async (input) => {
  try {
    const response = await apiClient.get('/address/autocomplete', {
      params: { input, country: 'AU' }
    });
    return response.data.predictions;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Address validation failed');
  }
};

// Cost estimation
export const getEstimate = async (formData) => {
  try {
    const response = await apiClient.post('/estimate/calculate', formData);
    return response.data.estimate;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Estimate calculation failed');
  }
};

// Lead capture
export const submitLead = async (leadData) => {
  try {
    const response = await apiClient.post('/leads/capture', leadData);
    return response.data.lead;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Lead submission failed');
  }
};
```

---

**Last Updated**: August 12, 2026  
**Next Review**: Before development sprint starts  
**Approval Status**: Ready for Handover

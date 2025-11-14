# Workflow DevKit Setup & Usage

## ✅ What's Been Implemented

### 1. **Bulk Operations Workflow**
- **Location:** `src/lib/workflows/bulk-operations.ts`
- **API:** `src/pages/api/cms/bulk.ts`
- **Features:**
  - Automatic retries for failed operations
  - Observability (logs, traces, metrics)
  - Durability (can resume if interrupted)
  - Processes multiple content items reliably

### 2. **Welcome Email Workflow**
- **Location:** `src/lib/workflows/welcome-email.ts`
- **Trigger:** Automatically triggered on user signup
- **Features:**
  - Sends welcome email to new users
  - Automatic retries if email service fails
  - Logs activity for tracking
  - Non-blocking (doesn't delay signup response)

### 3. **Workflow Steps**
- **Location:** `src/lib/workflows/steps.ts`
- **Available Steps:**
  - `updateContentStatus` - Update content with retries
  - `getUserInfo` - Fetch user data reliably
  - `sendWelcomeEmail` - Send emails with retries
  - `logUserActivity` - Track user actions

---

## 🚀 How It Works

### Bulk Operations

When you perform bulk operations in the CMS:

```typescript
// Before (no retries, no observability)
for (const itemId of items) {
  await updateContent(itemId); // If this fails, it's lost
}

// After (with Workflow DevKit)
await workflow(bulkContentOperation)(items, action, updates);
// ✅ Automatic retries
// ✅ Full observability
// ✅ Can resume if interrupted
```

### Welcome Email

When a new user signs up:

```typescript
// Automatically triggered in signup API
workflow(welcomeNewUser)(userId, email);
// ✅ Retries if email service is down
// ✅ Logs all attempts
// ✅ Non-blocking (doesn't delay signup)
```

---

## 📧 Email Service Integration

### Current Status
The welcome email workflow is set up but uses a placeholder email service. To enable actual email sending:

### Option 1: Resend (Recommended)

1. **Install Resend:**
   ```bash
   npm install resend
   ```

2. **Get API Key:**
   - Sign up at [resend.com](https://resend.com)
   - Create an API key
   - Add to `.env`:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     ```

3. **Update `src/lib/workflows/steps.ts`:**
   ```typescript
   import { Resend } from 'resend';
   import { FatalError } from 'workflow';
   
   export async function sendWelcomeEmail(email: string, displayName: string) {
     "use step";
     
     const resend = new Resend(process.env.RESEND_API_KEY);
     const { generateWelcomeEmailHTML, generateWelcomeEmailText } = await import('./email-templates');
     
     const { data, error } = await resend.emails.send({
       from: 'Real & Raw Gospel <welcome@yourdomain.com>',
       to: [email],
       subject: 'Welcome to Real & Raw Gospel!',
       html: generateWelcomeEmailHTML(displayName),
       text: generateWelcomeEmailText(displayName),
     });
     
     if (error) {
       throw new FatalError(`Failed to send email: ${error.message}`);
     }
     
     return {
       email,
       status: 'sent',
       sentAt: new Date().toISOString()
     };
   }
   ```

### Option 2: SendGrid

Similar setup with SendGrid SDK.

### Option 3: AWS SES

Use AWS SDK for SES integration.

---

## 🔍 Observability

### Viewing Workflow Runs

Workflow DevKit automatically provides:
- **Traces** - See every step execution
- **Logs** - Detailed execution logs
- **Metrics** - Performance and success rates
- **Time-travel** - Replay and debug past runs

### Accessing Workflow Dashboard

Workflow DevKit provides a dashboard to view all workflow runs. Check the Workflow DevKit documentation for dashboard access.

---

## 🛠️ Configuration

### Environment Variables

Add to your `.env` file:

```env
# Email Service (choose one)
RESEND_API_KEY=re_xxxxxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# OR
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx

# Workflow DevKit (if needed)
WORKFLOW_API_KEY=your_workflow_key
```

---

## 📝 Usage Examples

### Triggering Welcome Email Manually

```typescript
import { workflow } from 'workflow';
import { welcomeNewUser } from './lib/workflows/welcome-email';

// Trigger welcome email for existing user
await workflow(welcomeNewUser)(userId, email);
```

### Running Bulk Operations

```typescript
// Already integrated in /api/cms/bulk
// Just call the API endpoint with:
POST /api/cms/bulk
{
  "action": "publish",
  "items": ["id1", "id2", "id3"]
}
```

---

## 🎯 Benefits

### Before Workflow DevKit
- ❌ No automatic retries
- ❌ Lost operations on failure
- ❌ No observability
- ❌ Manual error handling
- ❌ No resumability

### After Workflow DevKit
- ✅ Automatic retries
- ✅ Durable operations
- ✅ Full observability
- ✅ Built-in error handling
- ✅ Can resume interrupted workflows
- ✅ Time-travel debugging

---

## 🔮 Future Enhancements

1. **Scheduled Workflows**
   - Send follow-up emails after 7 days
   - Weekly digest emails
   - Content review reminders

2. **More Workflows**
   - Content approval workflow
   - User onboarding sequence
   - Newsletter sending workflow

3. **AI Agent Workflows**
   - Content generation workflows
   - Auto-tagging workflows
   - Content moderation workflows

---

## 📚 Resources

- [Workflow DevKit Documentation](https://workflow.dev)
- [Workflow DevKit GitHub](https://github.com/workflow-dev/workflow)
- [Resend Documentation](https://resend.com/docs)

---

## ⚠️ Important Notes

1. **Email Service Required**: The welcome email workflow is set up but needs an email service integration to actually send emails.

2. **Workflow DevKit Setup**: Make sure Workflow DevKit is properly configured in your environment. Check the [Workflow DevKit setup guide](https://workflow.dev/docs/getting-started).

3. **Non-Blocking**: Welcome emails are triggered asynchronously and won't block user signup if they fail.

4. **Retries**: Workflows automatically retry failed steps. Configure retry policies if needed.


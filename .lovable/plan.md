

## Subscription Section -- Current State

The subscription system is **fully implemented and live**:

1. **UI**: Three pricing cards (Starter/Pro/Bootcamp) with Tunisian pricing, a registration form appears on plan selection, and three local payment methods (D17, Bank Transfer, Mandat Minute).

2. **Backend**: `subscription_requests` table exists with RLS allowing public inserts and admin-only reads. Currently 0 submissions.

3. **Flow**: User selects plan → form appears → fills name/email/phone → picks payment method → submits → data saved to DB → success message shown.

**No code changes needed** -- everything is in place. To test, scroll to the subscription section in the preview and complete a submission.


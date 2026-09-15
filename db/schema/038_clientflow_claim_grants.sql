-- ClientFlow Phase 1: tighten claim RPC grants (service_role only).
-- Supabase may leave anon/authenticated EXECUTE via default privileges.

REVOKE ALL ON FUNCTION clientflow_claim_email_message(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION clientflow_claim_email_message(TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION clientflow_claim_email_message(TEXT, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION clientflow_claim_email_message(TEXT, TEXT) TO service_role;

REVOKE ALL ON FUNCTION clientflow_claim_email_message(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION clientflow_claim_email_message(TEXT) FROM anon;
REVOKE ALL ON FUNCTION clientflow_claim_email_message(TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION clientflow_claim_email_message(TEXT) TO service_role;

/**
 * Supabase connection settings.
 *
 * Fill these in with your own project's values (Supabase Dashboard ->
 * Project Settings -> API -> "Project URL" and "anon public" key), then
 * save the file. See README.md "Set up the admin panel (Supabase)" for the
 * full walkthrough.
 *
 * The anon key is safe to expose in this front-end file — it only grants
 * what the Row Level Security policies in supabase/schema.sql allow
 * (public read of products, edits only while logged in).
 */
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const SUPABASE_CONFIGURED = SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

window.SUPABASE_CONFIGURED = SUPABASE_CONFIGURED;
window.supabaseClient = (SUPABASE_CONFIGURED && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://zpjuepsxqrqgavouzadr.supabase.co";
// const supabaseKey = "sb_publishable_CQ3uF2kwaAm5_1O4-5UGyA_sAu5iaC1";

// export const supabase = createClient(supabaseUrl, supabaseKey);
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
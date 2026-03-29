import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bozqirzbmxuihewmhgff.supabase.co";
const supabaseKey = "sb_publishable_DI6EVtETfcPZgvgM4h-JxQ_5QzEmW-C"; //import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export * from "./auth";
export * from "./categories";
export * from './objects';
export * from './places'

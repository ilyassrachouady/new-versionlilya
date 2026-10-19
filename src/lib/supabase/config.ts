const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export function getPublicSupabaseConfig() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase n’est pas configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.local.");
  }

  return { url: supabaseUrl, publishableKey: supabasePublishableKey };
}

export function getServerSupabaseConfig() {
  const publicConfig = getPublicSupabaseConfig();

  if (!supabaseSecretKey) {
    throw new Error("La clé serveur Supabase est absente. Ajoutez SUPABASE_SECRET_KEY dans .env.local.");
  }

  return { ...publicConfig, secretKey: supabaseSecretKey };
}

export const supabaseConfigState = {
  publicReady: Boolean(supabaseUrl && supabasePublishableKey),
  serverReady: Boolean(supabaseUrl && supabasePublishableKey && supabaseSecretKey),
};

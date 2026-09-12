const SUPABASE_URL = "https://ukktilhrpadjmadrlocr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_P_BxPMpdaUZh-g9kAB74Pg_Ax7THddH";

function getClient() {
    if (!window._kazuSupabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
        window._kazuSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window._kazuSupabaseClient || null;
}

window.kazuDb = {
    getClient,

    async getCatalog() {
        const client = getClient();
        if (!client) return null;
        const { data, error } = await client
            .from('v_public_catalog')
            .select('*')
            .order('display_order', { ascending: true });
        if (error) {
            console.error("Error al obtener catálogo:", error);
            return null;
        }
        return data;
    },

    async getClientCard(phone) {
        const client = getClient();
        if (!client || !phone) return null;
        const { data, error } = await client
            .from('clients')
            .select('id, phone, nickname, stamps_balance')
            .eq('phone', phone.trim())
            .maybeSingle();
        if (error) return null;
        return data;
    },

    async registerOrGetClient(phone, nickname) {
        const client = getClient();
        if (!client || !phone) return null;
        const cleanPhone = phone.trim();
        const { data: existing } = await client
            .from('clients')
            .select('id, phone, nickname, stamps_balance')
            .eq('phone', cleanPhone)
            .maybeSingle();

        if (existing) {
            if (nickname && nickname !== existing.nickname) {
                await client.from('clients').update({ nickname: nickname.trim() }).eq('id', existing.id);
            }
            return existing;
        }

        const { data: created, error } = await client
            .from('clients')
            .insert([{ phone: cleanPhone, nickname: nickname ? nickname.trim() : null }])
            .select('id, phone, nickname, stamps_balance')
            .single();

        if (error) {
            console.error("Error al registrar cliente:", error);
            return null;
        }
        return created;
    }
};

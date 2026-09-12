const SUPABASE_URL = "https://ukktilhrpadjmadrlocr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_P_BxPMpdaUZh-g9kAB74Pg_Ax7THddH";

const supabaseClient = (window.supabase && window.supabase.createClient) 
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
    : null;

window.kazuDb = {
    client: supabaseClient,
    async getCatalog() {
        if (!supabaseClient) return null;
        const { data, error } = await supabaseClient
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
        if (!supabaseClient || !phone) return null;
        const { data, error } = await supabaseClient
            .from('clients')
            .select('id, phone, nickname, stamps_balance')
            .eq('phone', phone.trim())
            .single();
        if (error) return null;
        return data;
    },
    async registerOrGetClient(phone, nickname) {
        if (!supabaseClient || !phone) return null;
        const cleanPhone = phone.trim();
        const { data: existing } = await supabaseClient
            .from('clients')
            .select('id, phone, nickname, stamps_balance')
            .eq('phone', cleanPhone)
            .maybeSingle();

        if (existing) {
            if (nickname && nickname !== existing.nickname) {
                await supabaseClient.from('clients').update({ nickname: nickname.trim() }).eq('id', existing.id);
            }
            return existing;
        }

        const { data: created, error } = await supabaseClient
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

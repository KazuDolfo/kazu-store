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
        const cleanPhone = phone.trim();
        try {
            const { data, error } = await client
                .from('clients')
                .select('id, phone, nickname, stamps_balance')
                .eq('phone', cleanPhone)
                .maybeSingle();

            if (error) return null;
            if (!data) return null;

            // Obtener historial de sellos para preservar estilo festivo histórico
            const { data: ledger } = await client
                .from('stamps_ledger')
                .select('id, amount, action, reason, festivity, created_at')
                .eq('client_id', data.id)
                .order('created_at', { ascending: true });

            return {
                ...data,
                ledger: ledger || []
            };
        } catch {
            return null;
        }
    },

    async claimWelcomeStamp(phone) {
        const client = getClient();
        const cleanPhone = (phone || "").trim().replace(/[^\d+]/g, "");
        if (!cleanPhone || cleanPhone.length < 8) return null;

        try {
            // Verificar si el cliente ya existe
            let { data: existing } = await client
                .from('clients')
                .select('id, stamps_balance')
                .eq('phone', cleanPhone)
                .maybeSingle();

            if (existing) {
                // Ya existe, no califica para bienvenida de nuevo
                return { isNew: false, client: existing };
            }

            // Cliente 100% nuevo: crear y otorgar 1er sello gratis de bienvenida
            const activeFestivity = document.documentElement.getAttribute('data-festivity') || 'standard';
            const { data: newClient, error: clientErr } = await client
                .from('clients')
                .insert([{ phone: cleanPhone, stamps_balance: 1, nickname: 'Miembro VIP' }])
                .select()
                .single();

            if (clientErr) throw clientErr;

            await client.from('stamps_ledger').insert([{
                client_id: newClient.id,
                amount: 1,
                action: 'earned',
                reason: '🎁 Sello Gratis de Bienvenida KazuPuntos',
                festivity: activeFestivity,
                balance_after: 1
            }]);

            return { isNew: true, client: newClient, festivity: activeFestivity };
        } catch (e) {
            console.warn("Fallo al registrar bienvenida en Supabase, aplicando localmente:", e);
            return { isNew: true, offline: true };
        }
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

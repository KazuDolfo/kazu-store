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
        const cleanPhone = phone.trim().replace(/[^\d+]/g, '');
        try {
            const { data, error } = await client
                .from('clients')
                .select('id, phone, nickname, stamps_balance, referral_credits, referred_by, referral_code')
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

            // Obtener conteo de amigos que usaron su código y compraron
            const userRefCode = data.referral_code || ('KZ-' + cleanPhone.slice(-4));
            const { data: refFriends } = await client
                .from('clients')
                .select('id, phone, stamps_balance')
                .eq('referred_by', userRefCode);

            // Amigos calificados: tienen 2 o más sellos (compra completada)
            const qualifiedFriends = (refFriends || []).filter(f => (f.stamps_balance || 0) >= 2);

            return {
                ...data,
                referral_code: userRefCode,
                referral_credits: data.referral_credits !== undefined && data.referral_credits !== null 
                    ? Number(data.referral_credits) 
                    : qualifiedFriends.length, // Si no hay columna aún, calcula 1 sol por amigo con compra
                qualified_friends_count: qualifiedFriends.length,
                total_friends_count: (refFriends || []).length,
                ledger: ledger || []
            };
        } catch {
            return null;
        }
    },

    async claimWelcomeStamp(phone, refCodeUsed = null) {
        const client = getClient();
        const cleanPhone = (phone || "").trim().replace(/[^\d+]/g, "");
        if (!cleanPhone || cleanPhone.length < 8) return null;

        try {
            // Verificar si el cliente ya existe
            let { data: existing } = await client
                .from('clients')
                .select('id, stamps_balance, referral_credits')
                .eq('phone', cleanPhone)
                .maybeSingle();

            if (existing) {
                // Ya existe, no califica para bienvenida de nuevo
                return { isNew: false, client: existing };
            }

            // Generar código de referido propio para este nuevo usuario
            const myRefCode = 'KZ-' + cleanPhone.slice(-4);

            // Cliente 100% nuevo: crear y otorgar 1er sello gratis de bienvenida
            const activeFestivity = document.documentElement.getAttribute('data-festivity') || 'standard';
            const { data: newClient, error: clientErr } = await client
                .from('clients')
                .insert([{
                    phone: cleanPhone,
                    stamps_balance: 1,
                    nickname: 'Miembro VIP',
                    referral_code: myRefCode,
                    referred_by: refCodeUsed ? String(refCodeUsed).trim().toUpperCase() : null,
                    referral_credits: 0
                }])
                .select()
                .single();

            if (clientErr) throw clientErr;

            await client.from('stamps_ledger').insert([{
                client_id: newClient.id,
                amount: 1,
                action: 'earned',
                reason: refCodeUsed ? `🎁 1er Sello Gratis + Amigo Referido (${refCodeUsed})` : '🎁 Sello Gratis de Bienvenida KazuPuntos',
                festivity: activeFestivity,
                balance_after: 1
            }]);

            return { isNew: true, client: newClient, festivity: activeFestivity, refCode: myRefCode };
        } catch (e) {
            console.warn("Fallo al registrar bienvenida en Supabase, aplicando localmente:", e);
            return { isNew: true, offline: true, refCode: 'KZ-' + cleanPhone.slice(-4) };
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

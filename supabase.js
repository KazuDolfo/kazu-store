const SUPABASE_URL = "https://ukktilhrpadjmadrlocr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_P_BxPMpdaUZh-g9kAB74Pg_Ax7THddH";

function getClient() {
    if (!window._kazuSupabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
        window._kazuSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window._kazuSupabaseClient || null;
}

// Caché en memoria para evitar re-consultar a Supabase en cada pulsación
const _cardCache = new Map();

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

    async getClientCard(phone, forceRefresh = false) {
        const client = getClient();
        if (!client || !phone) return null;
        const cleanPhone = phone.trim().replace(/[^\d+]/g, '');
        if (!cleanPhone) return null;

        // Retornar de inmediato si ya fue consultado recientemente (< 60 segundos)
        const cached = _cardCache.get(cleanPhone);
        if (!forceRefresh && cached && (Date.now() - cached.timestamp < 60000)) {
            return cached.data;
        }

        try {
            const { data, error } = await client
                .from('clients')
                .select('id, phone, nickname, stamps_balance')
                .eq('phone', cleanPhone)
                .maybeSingle();

            if (error || !data) return null;

            const userRefCode = 'KZ-' + cleanPhone.slice(-4);
            const { data: ledger } = await client
                .from('stamps_ledger')
                .select('id, amount, action, reason, festivity, created_at')
                .eq('client_id', data.id)
                .order('created_at', { ascending: true })
                .limit(20);

            const cardResult = {
                ...data,
                referral_code: userRefCode,
                referral_credits: 0,
                qualified_friends_count: 0,
                total_friends_count: 0,
                ledger: ledger || []
            };

            _cardCache.set(cleanPhone, { timestamp: Date.now(), data: cardResult });
            return cardResult;
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
                .select('id, phone, nickname, stamps_balance')
                .eq('phone', cleanPhone)
                .maybeSingle();

            if (existing) {
                // Ya existe, NO califica para nuevo sello de bienvenida
                return { isNew: false, client: existing };
            }

            const myRefCode = 'KZ-' + cleanPhone.slice(-4);
            const activeFestivity = document.documentElement.getAttribute('data-festivity') || 'standard';

            // Insertar únicamente las columnas existentes en la tabla
            const { data: newClient, error: clientErr } = await client
                .from('clients')
                .insert([{
                    phone: cleanPhone,
                    stamps_balance: 1,
                    nickname: 'Miembro VIP'
                }])
                .select('id, phone, nickname, stamps_balance')
                .single();

            if (clientErr) throw clientErr;

            await client.from('stamps_ledger').insert([{
                client_id: newClient.id,
                amount: 1,
                action: 'earned',
                reason: refCodeUsed ? `🎁 1er Sello Gratis + Ref: ${refCodeUsed}` : '🎁 Sello Gratis de Bienvenida KazuPuntos',
                festivity: activeFestivity,
                balance_after: 1
            }]);

            const newResult = {
                ...newClient,
                referral_code: myRefCode,
                referral_credits: 0,
                ledger: [{
                    amount: 1,
                    action: 'earned',
                    reason: '🎁 Sello Gratis de Bienvenida KazuPuntos',
                    festivity: activeFestivity,
                    created_at: new Date().toISOString()
                }]
            };

            _cardCache.set(cleanPhone, { timestamp: Date.now(), data: newResult });
            return { isNew: true, client: newResult, festivity: activeFestivity, refCode: myRefCode };
        } catch (e) {
            console.warn("Fallo al registrar bienvenida en Supabase, aplicando localmente:", e);
            return null;
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

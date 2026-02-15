
// This is a simulation of the Supabase Client
// In production, this will be replaced with real Supabase initialization

const STORAGE_KEY = 'supabase-mock-incomes';

export const supabase = {
    // Mocking the 'from' method
    from: (table: string) => {
        return {
            select: async () => {
                const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                return { data, error: null };
            },
            insert: async (newData: any) => {
                const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                // If array, spread it; if object, add one
                const rows = Array.isArray(newData) ? newData : [newData];

                // Add unique IDs
                const rowsWithIds = rows.map((row: any) => ({
                    ...row,
                    id: row.id || crypto.randomUUID(), // modern browsers support this
                    created_at: row.created_at || new Date().toISOString()
                }));

                const updated = [...existing, ...rowsWithIds];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                console.log(`[Supabase Mock] Inserted into ${table}:`, rowsWithIds);
                return { data: rowsWithIds, error: null };
            },
            update: async (updates: any) => {
                // Mock update logic would go here
                return { data: null, error: null };
            },
        },
            delete: () => {
                // Return a builder that expects .eq()
                return {
                    eq: async (column: string, value: any) => {
                        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                        // Filter out the item
                        const updated = existing.filter((item: any) => item[column] !== value);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                        console.log(`[Supabase Mock] Deleted where ${column} = ${value}`);
                        return { data: null, error: null };
                    }
                };
            }
    }
},
    auth: {
        getUser: async () => {
            const user = JSON.parse(localStorage.getItem('sb-session-mock') || 'null');
return { data: { user }, error: null };
        },
signOut: async () => {
    localStorage.removeItem('sb-session-mock');
}
    }
};

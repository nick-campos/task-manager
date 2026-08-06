import { vi } from 'vitest'

export const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),

    //Simula a "conexão" realtime. channel() e on() retornam
    //o próprio mock (encadeamento), e subscribe() também, assim
    //o componente consegue chamar .channel(...).on(...).subscribe()
    //sem quebrar, mesmo sem nenhum evento real acontecendo.
    channel: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    removeChannel: vi.fn(),
    auth: {
        getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } }
        })
    }
}
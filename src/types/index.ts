export type TaskStatus = 'pending' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Tasks {
    id: string
    user_id: string
    title: string
    description: string | null
    status: TaskStatus 
    priority: TaskPriority
    created_at: string 
}
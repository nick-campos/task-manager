export type TaskStatus = 'pending' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
    id: string
    user_id: string
    team_id: string | null 
    assigned_to: string | null
    title: string
    description: string | null
    status: TaskStatus 
    priority: TaskPriority
    created_at: string 
}

export interface Profile { 
    id: string
    name: string 
    email: string 
}

export interface Team { 
    id: string 
    name: string 
    created_by: string | null 
    created_at: string 
}

export interface TeamMember {
    id: string 
    team_id: string 
    user_id: string 
    role: 'admin' | 'member'
    joined_at: string
}
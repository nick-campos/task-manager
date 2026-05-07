import {supabase} from '../lib/supabase'
import type { Task  } from '../types'

export async function getTasks(): Promise<Task[]> {
    const {data, error} = await supabase
        .from('tasks')
        .select('*') //busca todas as colunas, o * significa "tudo".
        .order('created_at', { ascending: false}) //ordena as tarefas da mais recente para a mais antiga. Sem isso a ordem seria aleatória.

    if (error) throw error //lança o erro para cima e quem chamou decide o que fazer.
    return data
}

export async function createTask(
    title: string,
    description: string | null, //reflete o banco, o campo é opcional, pode ser null
    priority: Task['priority'] //aproveitamos o tipo que já existe no Task
): Promise<Task> {
    const { data: {user} } = await supabase.auth.getUser() // busca o usuário logado antes de inserir

    const{ data, error } = await supabase
        .from('tasks')
        .insert({title, description, priority, user_id: user!.id}) //passa o user_id explicitamente na inserção
        .single() //diz que esperamos exatamente um resultado, sem ele o Supabase retornaria um array

    if (error) throw error
    return data
}

export async function updateTask(
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority'>>
): Promise<Task> {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates) //passa apenas os campos que mudaram
        .eq('id', id) //Garante que só a tarefa com esse id seja atualizada.
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteTask(id: string): Promise<void> { //Só executa a ação e lança erro se algo der errado.
    const { error } = await supabase
        .from('tasks')
        .delete() //remove a linha da tabela.
        .eq('id', id) //garante que só a tarefa com esse id seja deletada.

    if (error) throw error
}
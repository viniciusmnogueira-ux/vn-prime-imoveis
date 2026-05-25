export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ImovelTipo = 'apartamento' | 'casa' | 'cobertura' | 'terreno' | 'comercial' | 'loja'
export type ImovelOperacao = 'venda' | 'aluguel'
export type ImovelStatus = 'rascunho' | 'pendente' | 'ativo' | 'pausado' | 'vendido'
export type PerfilTipo = 'proprietario' | 'corretor' | 'incorporadora' | 'admin'
export type PlanoProprietario = 'direta' | 'assistida' | 'completa'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nome: string | null
          telefone: string | null
          tipo: PerfilTipo
          avatar_url: string | null
          creci: string | null                 // só corretor/incorporadora
          plano: PlanoProprietario | null      // só proprietário
          plano_ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      imoveis: {
        Row: {
          id: string
          proprietario_id: string
          corretor_id: string | null
          titulo: string
          descricao: string | null
          tipo: ImovelTipo
          operacao: ImovelOperacao
          preco: number
          area_m2: number | null
          quartos: number | null
          suites: number | null
          banheiros: number | null
          vagas: number | null
          condominio: number | null
          iptu: number | null
          endereco: string | null
          bairro: string | null
          cidade: string
          estado: string
          cep: string | null
          lat: number | null
          lng: number | null
          fotos: string[]
          caracteristicas: string[]
          status: ImovelStatus
          destaque: boolean
          plano_label: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['imoveis']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['imoveis']['Insert']>
      }
      leads: {
        Row: {
          id: string
          imovel_id: string | null
          corretor_id: string | null
          proprietario_id: string | null
          nome: string
          email: string
          telefone: string | null
          mensagem: string | null
          origem: string | null
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'criado_em'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      corretores: {
        Row: {
          id: string
          profile_id: string
          creci: string
          especialidades: string[]
          bio: string | null
          foto_url: string | null
          ativo: boolean
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['corretores']['Row'], 'id' | 'criado_em'>
        Update: Partial<Database['public']['Tables']['corretores']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

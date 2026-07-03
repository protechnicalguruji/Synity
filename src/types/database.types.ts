/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          country: string | null
          timezone: string
          daily_lead_target: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          country?: string | null
          timezone?: string
          daily_lead_target?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          country?: string | null
          timezone?: string
          daily_lead_target?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          business_name: string
          owner_name: string | null
          phone: string | null
          whatsapp: string | null
          email: string | null
          website: string | null
          industry: string | null
          country: string | null
          status: 'NEW' | 'CALLED' | 'NO_ANSWER' | 'INTERESTED' | 'WHATSAPP_SENT' | 'FOLLOW_UP' | 'MEETING' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED' | 'LOST'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          estimated_value: number
          source: string | null
          notes: string | null
          last_contacted_at: string | null
          next_follow_up_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          owner_name?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          website?: string | null
          industry?: string | null
          country?: string | null
          status?: 'NEW' | 'CALLED' | 'NO_ANSWER' | 'INTERESTED' | 'WHATSAPP_SENT' | 'FOLLOW_UP' | 'MEETING' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED' | 'LOST'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          estimated_value?: number
          source?: string | null
          notes?: string | null
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          owner_name?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          website?: string | null
          industry?: string | null
          country?: string | null
          status?: 'NEW' | 'CALLED' | 'NO_ANSWER' | 'INTERESTED' | 'WHATSAPP_SENT' | 'FOLLOW_UP' | 'MEETING' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED' | 'LOST'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          estimated_value?: number
          source?: string | null
          notes?: string | null
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          lead_id: string
          user_id: string
          activity_type: string
          description: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id: string
          activity_type: string
          description: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string
          activity_type?: string
          description?: string
          metadata?: Json
          created_at?: string
        }
      }
      follow_ups: {
        Row: {
          id: string
          lead_id: string
          user_id: string
          scheduled_at: string
          completed: boolean
          completed_at: string | null
          followup_type: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id: string
          scheduled_at: string
          completed?: boolean
          completed_at?: string | null
          followup_type: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string
          scheduled_at?: string
          completed?: boolean
          completed_at?: string | null
          followup_type?: string
          notes?: string | null
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          lead_id: string
          user_id: string
          title: string
          meeting_time: string
          duration: number
          location: string | null
          meeting_type: string
          notes: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id: string
          title: string
          meeting_time: string
          duration: number
          location?: string | null
          meeting_type: string
          notes?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string
          title?: string
          meeting_time?: string
          duration?: number
          location?: string | null
          meeting_type?: string
          notes?: string | null
          status?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          lead_id: string | null
          title: string
          description: string | null
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status: 'TODO' | 'IN_PROGRESS' | 'DONE'
          due_date: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id?: string | null
          title: string
          description?: string | null
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lead_id?: string | null
          title?: string
          description?: string | null
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      lost_reasons: {
        Row: {
          id: string
          lead_id: string
          user_id: string
          reason: string
          details: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id: string
          reason: string
          details?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string
          reason?: string
          details?: string | null
          created_at?: string
        }
      }
      ai_insights: {
        Row: {
          id: string
          user_id: string
          lead_id: string
          insight_type: string
          title: string
          description: string
          confidence_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id: string
          insight_type: string
          title: string
          description: string
          confidence_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lead_id?: string
          insight_type?: string
          title?: string
          description?: string
          confidence_score?: number
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
          is_read?: boolean
          created_at?: string
        }
      }
      import_jobs: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          total_records: number
          successful_records: number
          failed_records: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_type: string
          total_records?: number
          successful_records?: number
          failed_records?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_type?: string
          total_records?: number
          successful_records?: number
          failed_records?: number
          status?: string
          created_at?: string
        }
      }
    }
    Enums: {
      lead_status: 'NEW' | 'CALLED' | 'NO_ANSWER' | 'INTERESTED' | 'WHATSAPP_SENT' | 'FOLLOW_UP' | 'MEETING' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED' | 'LOST'
      priority_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      task_status: 'TODO' | 'IN_PROGRESS' | 'DONE'
      notification_type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
    }
  }
}

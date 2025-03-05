export interface Event {
    id: number,
    company_id: number,
    user_id?: number,
    clerk_user_id?: string,
    title: string,
    description: string,
    start: Date,
    all_day: Boolean,
    time_format: string,
    created_at?: string
}
  
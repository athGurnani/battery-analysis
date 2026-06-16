export interface Database {
  public: {
    Tables: {
      test_runs: {
        Row: {
          id: string;
          internal_resistance: number;
          avg_temp: number;
          voltage_sag: number;
          capacity: number;
          recovery_time: number;
          team_number: number;
          battery_label: string;
          health_score: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          internal_resistance: number;
          avg_temp: number;
          voltage_sag: number;
          capacity: number;
          recovery_time: number;
          team_number: number;
          battery_label: string;
          health_score: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          internal_resistance?: number;
          avg_temp?: number;
          voltage_sag?: number;
          capacity?: number;
          recovery_time?: number;
          team_number?: number;
          battery_label?: string;
          health_score?: number;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

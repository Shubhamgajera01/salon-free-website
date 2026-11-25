
/*
  Phase 8 Supabase client helper.
  The official Supabase browser library is loaded only when you configure it.
  Add your public URL/key in js/config.js (never a service-role key).
*/
window.InfinitySupabase = {
  ready:false,
  client:null,

  async init(){
    if(!window.INFINITY_CONFIG?.SUPABASE_URL || !window.INFINITY_CONFIG?.SUPABASE_ANON_KEY){
      return false;
    }
    if(!window.supabase?.createClient) return false;

    this.client = window.supabase.createClient(
      window.INFINITY_CONFIG.SUPABASE_URL,
      window.INFINITY_CONFIG.SUPABASE_ANON_KEY
    );
    this.ready=true;
    return true;
  },

  async createAppointment(booking){
    if(!this.ready) throw new Error("Supabase is not configured.");
    const row={
      booking_code:booking.id,
      customer_name:booking.name,
      phone:booking.phone,
      email:booking.email||null,
      audience:booking.audience,
      service_id:booking.service[0],
      service_name:booking.service[1],
      appointment_date:booking.date,
      appointment_time:booking.time,
      price:booking.service[2],
      duration_minutes:parseInt(booking.service[3],10)||null,
      notes:booking.notes||null,
      status:"pending"
    };
    return await this.client.from("appointments").insert(row).select().single();
  },

  async getAppointments(){
    if(!this.ready) throw new Error("Supabase is not configured.");
    return await this.client.from("appointments").select("*").order("appointment_date",{ascending:true}).order("appointment_time",{ascending:true});
  },

  async updateStatus(id,status){
    if(!this.ready) throw new Error("Supabase is not configured.");
    return await this.client.from("appointments").update({status}).eq("appointment_id",id);
  }
};

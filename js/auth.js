
window.InfinityAuth = {
  async init(){
    if(window.InfinitySupabase) await window.InfinitySupabase.init();
    return !!window.InfinitySupabase?.ready;
  },

  async login(email,password){
    if(!await this.init()) throw new Error("Supabase is not configured.");
    return await window.InfinitySupabase.client.auth.signInWithPassword({email,password});
  },

  async logout(){
    if(window.InfinitySupabase?.ready) return await window.InfinitySupabase.client.auth.signOut();
  },

  async getSession(){
    if(!await this.init()) return null;
    const {data}=await window.InfinitySupabase.client.auth.getSession();
    return data?.session || null;
  },

  async getProfile(userId){
    if(!window.InfinitySupabase?.ready) return null;
    const {data,error}=await window.InfinitySupabase.client
      .from("staff_profiles").select("*").eq("user_id",userId).eq("active",true).maybeSingle();
    if(error) throw error;
    return data;
  }
};

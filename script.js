// Supabase Connection Settings
const SUPABASE_URL = 'https://pyjelzoqrokmczhdjfch.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_fVa5RbvGZ-0tabM2KO4Z2Q_utS57G6b';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Repair Form Submit Logic
if (document.getElementById('repairForm')) {
    document.getElementById('repairForm').onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const status = document.getElementById('status');

        // ခလုတ်ကို ခေတ္တပိတ်ထားပြီး Loading ပြခြင်း
        btn.disabled = true;
        btn.innerText = "SAVING...";

        // Database ထဲသို့ ထည့်မည့် အချက်အလက်များ
        const entry = {
            technician_name: document.getElementById('tech_name').value.toUpperCase().trim(),
            item_code: document.getElementById('item_code').value.toUpperCase().trim(),
            model: document.getElementById('model').value.toUpperCase().trim(),
            part: document.getElementById('part').value.toUpperCase().trim(),
            qty: parseInt(document.getElementById('qty').value) || 0,
            packing_qty: parseInt(document.getElementById('p_qty').value) || 0,

            // KPI အတွက် အချိန်မှတ်တမ်း (Hour & Min) - အသစ်ထည့်ထားသောအပိုင်း
            repair_hour: parseInt(document.getElementById('repair_hour').value) || 0,
            repair_min: parseInt(document.getElementById('repair_min').value) || 0,

            note: document.getElementById('note').value.toUpperCase().trim(),
            created_at: document.getElementById('entry_date').value
        };

        // Supabase သို့ Data ပို့ခြင်း
        const { error } = await _supabase.from('repair_logs').insert([entry]);

        if (error) {
            status.innerText = "ERROR: " + error.message;
            status.className = "mt-1 text-center fw-bold text-danger";
        } else {
            status.innerText = "SAVED SUCCESSFULLY! ✅";
            status.className = "mt-1 text-center fw-bold text-success";

            // Form ကို Reset လုပ်သော်လည်း Entry Date ကို မူလအတိုင်း ပြန်ထားခြင်း
            const curDate = document.getElementById('entry_date').value;
            e.target.reset();
            document.getElementById('entry_date').value = curDate;
            document.getElementById('packing').value = "PACKING"; 

            // Success Message ကို ၃ စက္ကန့်အကြာတွင် ဖျောက်ခြင်း
            setTimeout(() => { status.innerText = ""; }, 3000);
        }

        // ခလုတ်ကို ပြန်ဖွင့်ပေးခြင်း
        btn.disabled = false;
        btn.innerText = "SAVE RECORD";
    };
}
// Supabase Connection Settings
const SUPABASE_URL = 'https://pyjelzoqrokmczhdjfch.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_fVa5RbvGZ-0tabM2KO4Z2Q_utS57G6b';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Replaced Part အကွက် အသစ် ထပ်တိုးရန် Function (+) အဝိုင်းပုံစံ
function addPartRow() {
    const container = document.getElementById('partsContainer');
    const newRow = document.createElement('div');
    newRow.className = "row g-2 align-items-center part-row mb-1";
    newRow.innerHTML = `
        <div class="col-7">
            <input type="text" name="part[]" class="form-control mb-0" placeholder="PART NAME">
        </div>
        <div class="col-3">
            <input type="number" name="qty[]" class="form-control mb-0" min="0" placeholder="0">
        </div>
        <div class="col-2 text-center">
            <button type="button" class="btn btn-outline-danger btn-circle" onclick="removePartRow(this)" title="Remove">×</button>
        </div>
    `;
    container.appendChild(newRow);
}

// ထည့်ထားသော Part အကွက်ကို ပြန်ဖျက်ရန် (×)
function removePartRow(button) {
    const row = button.closest('.part-row');
    if (document.querySelectorAll('.part-row').length > 1) {
        row.remove();
    } else {
        alert("At least one part is required!");
    }
}

// Repair Form Submit Logic
if (document.getElementById('repairForm')) {
    document.getElementById('repairForm').onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const status = document.getElementById('status');

        btn.disabled = true;
        btn.innerText = "SAVING...";

        // ထည့်ထားသမျှ Part အကွက်များနှင့် Qty အကွက်များကို စုစည်းယူခြင်း
        const partInputs = document.querySelectorAll('input[name="part[]"]');
        const qtyInputs = document.querySelectorAll('input[name="qty[]"]');

        let partsArr = [];
        let totalQty = 0;

        partInputs.forEach((input, index) => {
            const pName = input.value.toUpperCase().trim();
            const pQty = parseInt(qtyInputs[index].value) || 0;
            if (pName) {
                partsArr.push(`${pName} (${pQty})`); 
                totalQty += pQty;
            }
        });

        // ရွေးချယ်ထားသော Status Type တစ်ခုတည်းကို ယူရန်
        const selectedStatus = document.querySelector('.status-chk:checked');
        const statusTypeText = selectedStatus ? selectedStatus.value : '';

        const entry = {
            cla_no: document.getElementById('cla_no').value.toUpperCase().trim(),
            technician_name: document.getElementById('tech_name').value.toUpperCase().trim(),
            item_code: document.getElementById('item_code').value.toUpperCase().trim(),
            model: document.getElementById('model').value.toUpperCase().trim(),
            part: partsArr.join(', '), 
            qty: totalQty, 
            packing_qty: parseInt(document.getElementById('p_qty').value) || 0,
            status_type: statusTypeText, // ရွေးထားတာ တစ်ခုတည်း ဝင်မည် (ဥပမာ - ADD STOCK)
            repair_hour: parseInt(document.getElementById('repair_hour').value) || 0,
            repair_min: parseInt(document.getElementById('repair_min').value) || 0,
            note: document.getElementById('note').value.toUpperCase().trim(),
            created_at: document.getElementById('entry_date').value
        };

        const { error } = await _supabase.from('repair_logs').insert([entry]);

        if (error) {
            status.innerText = "ERROR: " + error.message;
            status.className = "mt-1 text-center fw-bold text-danger";
        } else {
            status.innerText = "SAVED SUCCESSFULLY! ✅";
            status.className = "mt-1 text-center fw-bold text-success";

            const curDate = document.getElementById('entry_date').value;
            e.target.reset();
            document.getElementById('entry_date').value = curDate;
            document.getElementById('packing').value = "PACKING"; 

            // Part အကွက်များကို ပထမတစ်တန်းမှလွဲ၍ ကျန်တာတွေ ရှင်းထုတ်ပြီး အဝိုင်းခလုတ်ပုံစံပြန်ထည့်ရန်
            const container = document.getElementById('partsContainer');
            container.innerHTML = `
                <div class="row g-2 align-items-center part-row mb-1">
                    <div class="col-7">
                        <label class="form-label">Replaced Part</label>
                        <input type="text" name="part[]" class="form-control mb-0" placeholder="PART NAME" required>
                    </div>
                    <div class="col-3">
                        <label class="form-label">Qty</label>
                        <input type="number" name="qty[]" class="form-control mb-0" min="0" placeholder="0" required>
                    </div>
                    <div class="col-2 text-center">
                        <label class="form-label">&nbsp;</label>
                        <button type="button" class="btn btn-outline-primary btn-circle" onclick="addPartRow()">+</button>
                    </div>
                </div>
            `;

            setTimeout(() => { status.innerText = ""; }, 3000);
        }

        btn.disabled = false;
        btn.innerText = "SAVE RECORD";
    };
}

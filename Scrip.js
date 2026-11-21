// 1. Data Kategori Sampah & Cara Pengolahan
const wasteCategories = {
  organik: {
    title: "Sampah Organik (Wadah Hijau)",
    color: "#22c55e",
    description: "Sampah yang berasal dari sisa makhluk hidup dan mudah terurai secara alami oleh mikroorganisme.",
    examples: [
      "Sisa makanan, sayur, dan kulit buah",
      "Daun kering, ranting pohon, dan potongan rumput",
      "Ampas kopi, kantong teh celup, dan cangkang telur"
    ],
    processing: [
      "Komposting (Kompos): Olah menggunakan komposter atau lubang biopori menjadi pupuk tanaman.",
      "Budidaya Maggot BSF: Gunakan sisa makanan basah sebagai pakan larva Black Soldier Fly.",
      "Eco-Enzyme: Fermentasi kulit buah dengan gula merah dan air selama 3 bulan untuk cairan pembersih alami."
    ]
  },
  anorganik: {
    title: "Sampah Anorganik (Wadah Kuning)",
    color: "#eab308",
    description: "Sampah non-hayati yang sulit terurai secara alami tetapi memiliki nilai ekonomi tinggi untuk didaur ulang.",
    examples: [
      "Botol plastik PET, gelas kemasan, dan kantong kresek bersih",
      "Kardus, kertas HVS, koran, dan majalah bekas",
      "Kaleng aluminium, besi tua, dan botol kaca"
    ],
    processing: [
      "Setor ke Bank Sampah: Tukarkan sampah terpilah menjadi saldo tabungan atau poin.",
      "Upcycling (Kerajinan): Ubah botol dan kardus menjadi pot tanaman, wadah penyimpanan, atau ecobrick.",
      "Pabrik Daur Ulang: Cacah plastik dan lebur logam untuk dijadikan bahan baku produk baru."
    ]
  },
  b3: {
    title: "Sampah B3 – Bahan Berbahaya & Beracun (Wadah Merah)",
    color: "#ef4444",
    description: "Limbah yang mengandung zat beracun, mudah terbakar, korosif, atau berbahaya bagi kesehatan dan lingkungan.",
    examples: [
      "Baterai bekas, lampu neon/LED rusak, dan limbah elektronik (e-waste)",
      "Kemasan obat kedaluwarsa, jarum suntik, dan masker medis",
      "Kaleng aerosol, cat, oli bekas, dan cairan pembersih kimia"
    ],
    processing: [
      "Jangan Campur & Jangan Dibakar: Pembakaran limbah B3 melepaskan gas beracun dioksin.",
      "Drop-Box E-Waste / B3: Serahkan ke titik pengumpulan limbah B3 resmi di dinas lingkungan hidup atau ritel elektronik.",
      "Disinfeksi Limbah Medis: Gunting masker sekali pakai dan semprot disinfektan sebelum dibungkus terpisah."
    ]
  }
};

// Render Kategori
const categoryDetailEl = document.getElementById("category-detail");
const tabButtons = document.querySelectorAll(".tab-btn");

function renderCategory(key) {
  const data = wasteCategories[key];
  categoryDetailEl.style.borderLeftColor = data.color;
  categoryDetailEl.innerHTML = `
    <h3>${data.title}</h3>
    <p style="margin-top: 8px; color: #475569;">${data.description}</p>
    <div class="category-grid">
      <div>
        <h4>📦 Contoh Jenis Sampah:</h4>
        <ul>${data.examples.map(item => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div>
        <h4>♻️ Cara Pengolahan Tepat:</h4>
        <ul>${data.processing.map(step => `<li>${step}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderCategory(btn.dataset.category);
  });
});

renderCategory("organik");

// 2. Fitur Pemindai Foto Sampah & Google Lens
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("waste-image-input");
const imagePreview = document.getElementById("image-preview");
const previewContainer = document.getElementById("preview-container");
const btnAnalyze = document.getElementById("btn-analyze");
const scanResult = document.getElementById("scan-result");

let selectedFileName = "";

dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  selectedFileName = file.name.toLowerCase();
  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.src = event.target.result;
    imagePreview.classList.remove("hidden");
    previewContainer.classList.add("hidden");
    btnAnalyze.disabled = false;
    scanResult.classList.add("hidden");
  };
  reader.readAsDataURL(file);
});

btnAnalyze.addEventListener("click", () => {
  let detectedCategory = "Anorganik (Wadah Kuning)";
  let suggestion = "Pastikan sampah dalam kondisi bersih dan kering sebelum disetor ke Bank Sampah.";

  if (selectedFileName.match(/daun|sayur|buah|makanan|nasi|organik|kulit/)) {
    detectedCategory = "Organik (Wadah Hijau)";
    suggestion = "Cocok diolah menjadi pupuk kompos, eco-enzyme, atau pakan maggot.";
  } else if (selectedFileName.match(/baterai|lampu|obat|elektronik|kabel|hp|b3|kimia/)) {
    detectedCategory = "Limbah B3 (Wadah Merah)";
    suggestion = "Simpan di wadah tertutup dan serahkan ke drop-box limbah B3/e-waste terdekat.";
  }

  scanResult.classList.remove("hidden");
  scanResult.innerHTML = `
    <h4>✅ Hasil Analisis Awal: <span style="color:#15803d">${detectedCategory}</span></h4>
    <p style="margin: 8px 0;">${suggestion}</p>
    <p style="font-size: 0.9rem; color: #475569;">
      Ingin pencocokan visual objek secara spesifik dengan database gambar global? Klik tombol <strong>Buka Google Lens</strong> di atas dan unggah foto yang sama.
    </p>
  `;
});

// 3. Data & Pencarian Lokasi Bank Sampah
const wasteBanks = [
  {
    name: "Bank Sampah Induk Melati Bersih",
    city: "Jakarta Selatan",
    address: "Jl. Raya Pasar Minggu No. 42, Jakarta Selatan",
    accepts: ["Plastik", "Kertas", "Logam", "Minyak Jelantah"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bank+Sampah+Jakarta+Selatan"
  },
  {
    name: "Bank Sampah Hijau Lestari",
    city: "Bandung",
    address: "Jl. Cihampelas No. 118, Coblong, Kota Bandung",
    accepts: ["Organik", "Plastik PET", "Kardus"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bank+Sampah+Bandung"
  },
  {
    name: "Bank Sampah Bumi Mandiri",
    city: "Subang",
    address: "Jl. Otto Iskandardinata No. 75, Subang",
    accepts: ["Anorganik", "Elektronik/B3", "Kaca"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bank+Sampah+Subang"
  },
  {
    name: "Bank Sampah Surabaya Eco",
    city: "Surabaya",
    address: "Jl. Raya Darmo No. 90, Wonokromo, Surabaya",
    accepts: ["Plastik", "Kaleng", "Kertas"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bank+Sampah+Surabaya"
  }
];

const bankListEl = document.getElementById("bank-list");
const searchBankInput = document.getElementById("search-bank");
const btnNearMe = document.getElementById("btn-near-me");
const geoStatus = document.getElementById("geo-status");

function renderBanks(list) {
  if (list.length === 0) {
    bankListEl.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Lokasi tidak ditemukan. Coba kata kunci kota lain.</p>`;
    return;
  }

  bankListEl.innerHTML = list.map(bank => `
    <div class="bank-card">
      <h3>${bank.name}</h3>
      <p style="font-size: 0.9rem; color: #64748b;">📍 ${bank.address}</p>
      <div>
        ${bank.accepts.map(tag => `<span class="bank-tag">${tag}</span>`).join("")}
      </div>
      <a href="${bank.mapsUrl}" target="_blank" rel="noopener noreferrer" class="bank-link">Buka di Google Maps →</a>
    </div>
  `).join("");
}

searchBankInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = wasteBanks.filter(bank =>
    bank.name.toLowerCase().includes(keyword) ||
    bank.city.toLowerCase().includes(keyword) ||
    bank.address.toLowerCase().includes(keyword) ||
    bank.accepts.some(a => a.toLowerCase().includes(keyword))
  );
  renderBanks(filtered);
});

btnNearMe.addEventListener("click", () => {
  if (!navigator.geolocation) {
    geoStatus.textContent = "Browser tidak mendukung geolokasi.";
    return;
  }
  geoStatus.textContent = "Mendeteksi koordinat lokasi Anda...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      geoStatus.innerHTML = `Lokasi terdeteksi (${latitude.toFixed(4)}, ${longitude.toFixed(4)}). <a href="https://www.google.com/maps/search/bank+sampah/@${latitude},${longitude},14z" target="_blank" rel="noopener noreferrer"><strong>Lihat Bank Sampah Terdekat di Google Maps ↗</strong></a>`;
    },
    () => {
      geoStatus.textContent = "Akses lokasi ditolak. Silakan ketik nama kota Anda di kolom pencarian.";
    }
  );
});

renderBanks(wasteBanks);

// 4. Pencatatan Kontribusi Daur Ulang (LocalStorage)
const contributionForm = document.getElementById("contribution-form");
const historyBody = document.getElementById("history-body");
const heroTotalKg = document.getElementById("hero-total-kg");
const heroTotalPoin = document.getElementById("hero-total-poin");
const btnClearHistory = document.getElementById("btn-clear-history");

let contributions = JSON.parse(localStorage.getItem("ecosort_contributions")) || [
  { date: "2026-11-20", type: "Anorganik", item: "Botol Plastik PET", weight: 2.5, points: 25 }
];

function saveAndRenderContributions() {
  localStorage.setItem("ecosort_contributions", JSON.stringify(contributions));

  let totalKg = 0;
  let totalPoints = 0;

  historyBody.innerHTML = contributions.map(entry => {
    totalKg += parseFloat(entry.weight);
    totalPoints += parseInt(entry.points);
    return `
      <tr>
        <td>${entry.date}</td>
        <td><strong>${entry.type}</strong></td>
        <td>${entry.item}</td>
        <td>${entry.weight} kg</td>
        <td>+${entry.points} pts</td>
      </tr>
    `;
  }).join("");

  heroTotalKg.textContent = totalKg.toFixed(1);
  heroTotalPoin.textContent = totalPoints;
}

contributionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const type = document.getElementById("waste-type").value;
  const item = document.getElementById("waste-item").value.trim();
  const weight = parseFloat(document.getElementById("waste-weight").value);

  // Perhitungan poin: 10 poin per kg (B3 mendapat bonus 15 poin/kg)
  const multiplier = type === "B3" ? 15 : 10;
  const points = Math.round(weight * multiplier);
  const today = new Date().toISOString().split("T")[0];

  contributions.unshift({ date: today, type, item, weight, points });
  saveAndRenderContributions();
  contributionForm.reset();
});

btnClearHistory.addEventListener("click", () => {
  if (confirm("Hapus seluruh riwayat kontribusi daur ulang?")) {
    contributions = [];
    saveAndRenderContributions();
  }
});

saveAndRenderContributions();
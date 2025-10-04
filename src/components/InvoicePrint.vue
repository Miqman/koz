<template>
  <div class="font-sans text-sm text-black bg-white">
    <div class="p-2 max-w-[800px] mx-auto">
      <div class="flex justify-between items-start mb-4">
        <div>
          <div class="font-bold text-lg">Pemerintah Daerah</div>
          <div class="font-bold text-xl">Kabupaten A</div>
        </div>
        <div class="text-right">
          <div class="font-bold text-xl">FAKTUR</div>
        </div>
      </div>

      <q-separator class="!my-2" size="3px" color="black" />

      <div class="grid grid-cols-5 gap-6 text-[10px] mb-6">
        <div class="col-span-2">
          <div class="grid grid-cols-2">
            <strong>Nama Pelanggan</strong>
            <p>: Charles Simanalagi</p>
          </div>
          <div class="grid grid-cols-2">
            <strong>Nama Perusahaan</strong>
            <p>: PT Anugrah Tambang</p>
          </div>
          <div class="grid grid-cols-2">
            <strong>No Ponsel</strong>
            <p>: 081234567890</p>
          </div>
          <div class="grid grid-cols-2">
            <strong>Email</strong>
            <p>: charles@ptanugrah.com</p>
          </div>
        </div>
        <div class="col-span-2">
          <div class="grid grid-cols-2">
            <strong>Petugas</strong>
            <p>: Tono</p>
          </div>
          <div class="grid grid-cols-2">
            <strong>Tanggal</strong>
            <p>: 25/05/2025</p>
          </div>
          <div class="grid grid-cols-2">
            <strong>No. Faktur</strong>
            <p>: INV0001</p>
          </div>
          <div class="grid grid-cols-2">
            <strong>Pembayaran</strong>
            <p>: Transfer Bank</p>
          </div>
        </div>

        <div class="bg-red-200">qrcode</div>
      </div>

      <table class="w-full text-left border border-collapse mb-8 text-[10px]">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-2 py-1">No</th>
            <th class="border px-2 py-1">Nama Barang</th>
            <th class="border px-2 py-1">Jml</th>
            <th class="border px-2 py-1">Satuan</th>
            <th class="border px-2 py-1">Pajak</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-2 py-1">1</td>
            <td class="border px-2 py-1">Pasir</td>
            <td class="border px-2 py-1">10</td>
            <td class="border px-2 py-1">ton</td>
            <td class="border px-2 py-1">10.000.000</td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between text-[10px] mt-8">
        <div>
          <p>Penerima/Pembeli</p>
          <p class="mt-10">Charles Simanalagi</p>
        </div>
        <div>
          <p>Pemda Kabupaten A</p>
          <p class="mt-10">Tono</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
// Tambahkan auto print ketika halaman terbuka
onMounted(() => {
  window.print()
})
</script>

<style>
@media print {
  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
  }
}
</style>

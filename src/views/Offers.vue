<template>
  <v-app class="offers-page">
    <v-container>
      <v-card elevation="6" class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center">
          <h4 class="text-white">Offers List</h4>
          <v-btn color="green darken-2" dark @click="openAddDialog" class="rounded-pill px-4">
            <v-icon left>mdi-plus</v-icon>
            Add New Offer
          </v-btn>
        </v-card-title>

        <offers-table
          :offers="filteredOffers"
          :headers="headers"
          :items-per-page="itemsPerPage"
          :search="search"
          :loading="loading"
          @edit="editOffer"
          @delete="confirmDeleteOffer"
          @qr="generateQRCode"
        />

        <offer-form
          v-model="editDialog"
          :offer="offerData"
          @save="saveOffer"
        />

        <delete-dialog
          v-model="deleteDialog"
          :offer="selectedOffer"
          @confirm="deleteOffer"
        />
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import OffersTable from "@/components/Offers/OffersTable.vue";
import OfferForm from "@/components/Offers/OfferForm.vue";
import DeleteDialog from "@/components/Offers/DeleteDialog.vue";
import { toast } from "vue3-toastify";
import QRCode from "qrcode";

export default {
  components: { OffersTable, OfferForm, DeleteDialog },
  data() {
    return {
      offers: [
        { id: 1, offer_number: "OF-001", client_name: "ABC Corp", offer_date: "2025-08-10", validity_days: 30, total_amount: 5000, details: "Sample details" },
        { id: 2, offer_number: "OF-002", client_name: "XYZ Ltd", offer_date: "2025-08-15", validity_days: 15, total_amount: 12000, details: "Another details" },
      ],
      search: "",
      loading: false,
      editDialog: false,
      deleteDialog: false,
      offerData: {},
      selectedOffer: {},
      itemsPerPage: 6,
      headers: [
        { text: "Offer No", value: "offer_number", align: "center" },
        { text: "Client", value: "client_name", align: "center" },
        { text: "Date", value: "offer_date", align: "center" },
        { text: "Validity", value: "validity_days", align: "center" },
        { text: "Amount", value: "total_amount", align: "center" },
        { text: "Actions", value: "actions", align: "center", sortable: false }
      ]
    };
  },
  computed: {
    filteredOffers() {
      return this.offers.filter(o =>
        o.offer_number.toLowerCase().includes(this.search.toLowerCase()) ||
        o.client_name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    openAddDialog() {
      this.offerData = {};
      this.editDialog = true;
    },
    editOffer(offer) {
      this.offerData = { ...offer };
      this.editDialog = true;
    },
    saveOffer(offer) {
      if (offer.id) {
        const index = this.offers.findIndex(o => o.id === offer.id);
        this.offers.splice(index, 1, offer);
        toast.success("Offer updated successfully ✅");
      } else {
        offer.id = Date.now();
        this.offers.push({ ...offer });
        toast.success("New offer added ✅");
      }
      this.editDialog = false;
    },
    confirmDeleteOffer(offer) {
      this.selectedOffer = offer;
      this.deleteDialog = true;
    },
    deleteOffer(offer) {
      this.offers = this.offers.filter(o => o.id !== offer.id);
      this.deleteDialog = false;
      toast.error("Offer deleted ❌");
    },
    async generateQRCode(offerNumber) {
      const qr = await QRCode.toDataURL(offerNumber);
      const w = window.open("");
      w.document.write(`<img src="${qr}" alt="QR Code"/>`);
    }
  }
};
</script>

<style scoped>
.offers-page {
  min-height: 100vh;
  background-color:  transparent;
  padding-top: 40px;
  border-radius: 12px 12px 0 0;
}

.v-card-title {
  background: rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #4caf50, #2e7d32); 
  padding: 20px;
  border-radius: 12px 12px 0 0;
}
</style>

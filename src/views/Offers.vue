<template>
  <v-app>
    <v-container style="background-color: #f7f7f9;">
      <v-card class="mx-auto my-5 elevation-3 rounded-lg" max-width="1200">
        <v-card-title class="primary white--text d-flex align-center py-4">
          <v-icon class="mr-2">mdi-file-document</v-icon> Offers List
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="fetchOffers" :disabled="loading">
            <v-icon v-if="!loading">mdi-refresh</v-icon>
            <v-progress-circular v-else indeterminate size="24" color="white" />
          </v-btn>
        </v-card-title>

        <v-progress-linear v-if="loading" indeterminate color="primary" height="4" />

        <v-card-text class="pa-5">
          <v-row class="mb-4" align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="search"
                label="Search by offer number or client..."
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6" class="text-md-right text-left">
              <v-btn style="width: 180px; padding: 10px;" color="blue" dark @click="openAddDialog">
                <v-icon left>mdi-plus</v-icon> Add New Offer
              </v-btn>
            </v-col>
          </v-row>

          <!-- Table -->
          <v-data-table
            :headers="headers"
            :items="filteredOffers"
            :items-per-page="itemsPerPage"
            :search="search"
            dense
            fixed-header
            height="400px"
            :loading="loading"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-center">{{ item.offer_number }}</td>
                <td class="text-center">{{ item.client_name }}</td>
                <td class="text-center">{{ item.offer_date }}</td>
                <td class="text-center">{{ item.validity_days }} Days</td>
                <td class="text-center">{{ item.total_amount }} $</td>
                <td class="text-center">
                  <v-btn icon color="blue" @click="editOffer(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="red" @click="confirmDeleteOffer(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon color="green" @click="generateQRCode(item.offer_number)">
                    <v-icon>mdi-qrcode</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="editDialog" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ offerData.id ? 'Edit Offer' : 'Add New Offer' }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="offerData.offer_number" label="Offer Number" outlined />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="offerData.client_name" label="Client Name" outlined />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="offerData.offer_date" type="date" label="Offer Date" outlined />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="offerData.validity_days" type="number" label="Validity (days)" outlined />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="offerData.total_amount" type="number" label="Total Amount" outlined />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="offerData.details" label="Details" outlined />
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input v-model="offerData.offer_file" label="Upload Offer File" outlined accept=".pdf,.doc,.docx" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input v-model="offerData.client_logo" label="Upload Client Logo" outlined accept="image/*" />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" @click="saveOffer">Save</v-btn>
            <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete offer {{ selectedOffer.offer_number }}?
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" @click="deleteOffer">Delete</v-btn>
            <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import QRCode from "qrcode";

export default {
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
        { text: "Actions", value: "actions", align: "center", sortable: false },
      ],
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
    fetchOffers() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 800); // simulate loading
    },
    openAddDialog() {
      this.offerData = {};
      this.editDialog = true;
    },
    editOffer(offer) {
      this.offerData = { ...offer };
      this.editDialog = true;
    },
    saveOffer() {
      if (this.offerData.id) {
        const index = this.offers.findIndex(o => o.id === this.offerData.id);
        this.offers[index] = { ...this.offerData };
        toast.success("Offer updated successfully ✅");
      } else {
        this.offerData.id = Date.now();
        this.offers.push({ ...this.offerData });
        toast.success("New offer added ✅");
      }
      this.editDialog = false;
    },
    confirmDeleteOffer(offer) {
      this.selectedOffer = offer;
      this.deleteDialog = true;
    },
    deleteOffer() {
      this.offers = this.offers.filter(o => o.id !== this.selectedOffer.id);
      this.deleteDialog = false;
      toast.error("Offer deleted ❌");
    },
    async generateQRCode(offerNumber) {
      const qr = await QRCode.toDataURL(offerNumber);
      const w = window.open("");
      w.document.write(`<img src="${qr}" alt="QR Code"/>`);
    },
  },
};
</script>

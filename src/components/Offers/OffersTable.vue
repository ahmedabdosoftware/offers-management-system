<template>
  <div>
    <!-- Filters Card -->
    <v-card class="mb-6" outlined elevation="1">
      <v-card-title>
        <v-icon left color="primary">mdi-filter-variant</v-icon>
        <span class="text-h6">Filter Offers</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-row dense>
          <!-- Offer Number -->
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.offer_number"
              label="Offer Number"
              prepend-inner-icon="mdi-pound"
              dense
              outlined
              clearable
            />
          </v-col>

          <!-- Client Name -->
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.client_name"
              label="Client Name"
              prepend-inner-icon="mdi-account"
              dense
              outlined
              clearable
            />
          </v-col>

          <!-- Date From -->
          <v-col cols="12" md="3">
            <v-menu v-model="menuDateFrom" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="From Date"
                  prepend-inner-icon="mdi-calendar-start"
                  readonly dense outlined
                  v-bind="attrs" v-on="on"
                />
              </template>
              <v-date-picker v-model="filters.dateFrom" @input="menuDateFrom = false" />
            </v-menu>
          </v-col>

          <!-- Date To -->
          <v-col cols="12" md="3">
            <v-menu v-model="menuDateTo" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.dateTo"
                  label="To Date"
                  prepend-inner-icon="mdi-calendar-end"
                  readonly dense outlined
                  v-bind="attrs" v-on="on"
                />
              </template>
              <v-date-picker v-model="filters.dateTo" @input="menuDateTo = false" />
            </v-menu>
          </v-col>

          <!-- Offer Status -->
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              :items="['Active', 'Expired']"
              label="Offer Status"
              prepend-inner-icon="mdi-check-decagram"
              dense outlined clearable
            />
          </v-col>

          <!-- Amount Min -->
          <v-col cols="12" md="3">
            <v-text-field
              v-model.number="filters.amountMin"
              label="Amount From"
              prepend-inner-icon="mdi-currency-usd"
              type="number"
              dense outlined
            />
          </v-col>

          <!-- Amount Max -->
          <v-col cols="12" md="3">
            <v-text-field
              v-model.number="filters.amountMax"
              label="Amount To"
              prepend-inner-icon="mdi-currency-usd"
              type="number"
              dense outlined
            />
          </v-col>

          <!-- Buttons -->
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn color="primary" class="mr-2" @click="applyFilters">
              <v-icon left>mdi-magnify</v-icon> Search
            </v-btn>
            <v-btn color="grey" outlined @click="resetFilters">
              <v-icon left>mdi-refresh</v-icon> Reset
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Offers Table -->
   <v-data-table
        :items="filteredOffers"
        :items-per-page="itemsPerPage"
        dense
        fixed-header
        height="400"
        :loading="loading"
    >
    <!-- Offer Number -->
    <template #[`item.offer_number`]="{ item }">
        <div class="text-center font-weight-medium">
        <v-chip x-small color="indigo" text-color="white">
            {{ item.offer_number }}
        </v-chip>
        </div>
    </template>

    <!-- Client -->
    <template #[`item.client_name`]="{ item }">
        <div class="text-center">
        <v-icon x-small left color="grey">mdi-account</v-icon>
        {{ item.client_name }}
        </div>
    </template>

    <!-- Date -->
    <template #[`item.offer_date`]="{ item }">
        <div class="text-center">
        <v-icon x-small left color="blue">mdi-calendar</v-icon>
        {{ new Date(item.offer_date).toLocaleDateString() }}
        </div>
    </template>

    <!-- Validity -->
    <template #[`item.validity_days`]="{ item }">
        <div class="text-center">
        <v-chip
            x-small
            :color="item.validity_days > 0 ? 'green' : 'red'"
            text-color="white"
        >
            {{ item.validity_days }} يوم
        </v-chip>
        </div>
    </template>

    <!-- Amount -->
    <template #[`item.total_amount`]="{ item }">
        <div class="text-center font-weight-bold">
        <v-icon x-small left color="green">mdi-currency-usd</v-icon>
        {{ item.total_amount.toLocaleString() }}
        </div>
    </template>

    <!-- Actions -->
    <template #[`item.actions`]="{ item }">
        <div class="text-center">
        <v-btn icon x-small color="blue" class="mx-1" @click="$emit('edit', item)">
            <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon x-small color="red" class="mx-1" @click="$emit('delete', item)">
            <v-icon small>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon x-small color="green" class="mx-1" @click="$emit('qr', item.offer_number)">
            <v-icon small>mdi-qrcode</v-icon>
        </v-btn>
        </div>
    </template>
   </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    offers: Array,
    headers: {
      type: Array,
      default: () => [
        { text: "Offer Number", value: "offer_number", align: "center" },
        { text: "Client Name", value: "client_name", align: "center" },
        { text: "Offer Date", value: "offer_date", align: "center" },
        { text: "Validity (days)", value: "validity_days", align: "center" },
        { text: "Total Amount", value: "total_amount", align: "center" },
        { text: "Actions", value: "actions", align: "center", sortable: false },
      ],
    },
    loading: Boolean,
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      filters: {
        offer_number: "",
        client_name: "",
        dateFrom: null,
        dateTo: null,
        status: null,
        amountMin: null,
        amountMax: null,
      },
      menuDateFrom: false,
      menuDateTo: false,
    };
  },
  computed: {
    filteredOffers() {
      return this.offers.filter((o) => {
        const matchesOfferNumber = this.filters.offer_number
          ? o.offer_number.toString().includes(this.filters.offer_number)
          : true;
        const matchesClient = this.filters.client_name
          ? o.client_name.toLowerCase().includes(this.filters.client_name.toLowerCase())
          : true;
        const matchesDateFrom = this.filters.dateFrom
          ? new Date(o.offer_date) >= new Date(this.filters.dateFrom)
          : true;
        const matchesDateTo = this.filters.dateTo
          ? new Date(o.offer_date) <= new Date(this.filters.dateTo)
          : true;
        const isValid = this.filters.status
          ? this.filters.status === "Active"
            ? o.validity_days > 0
            : o.validity_days <= 0
          : true;
        const matchesAmountMin = this.filters.amountMin
          ? o.total_amount >= this.filters.amountMin
          : true;
        const matchesAmountMax = this.filters.amountMax
          ? o.total_amount <= this.filters.amountMax
          : true;

        return (
          matchesOfferNumber &&
          matchesClient &&
          matchesDateFrom &&
          matchesDateTo &&
          isValid &&
          matchesAmountMin &&
          matchesAmountMax
        );
      });
    },
  },
  methods: {
    resetFilters() {
      this.filters = {
        offer_number: "",
        client_name: "",
        dateFrom: null,
        dateTo: null,
        status: null,
        amountMin: null,
        amountMax: null,
      };
    },
    applyFilters() {
    },
  },
};
</script>
<style scoped>
::v-deep(.v-field__overlay) {
    border-radius: inherit;
    pointer-events: none;
    background-color: white !important;
}

</style>
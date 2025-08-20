<template>
  <v-dialog v-model="dialog" max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formData.id ? 'Edit Offer' : 'Add New Offer' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.offer_number" label="Offer Number" outlined />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.client_name" label="Client Name" outlined />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.offer_date" type="date" label="Offer Date" outlined />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.validity_days" type="number" label="Validity (days)" outlined />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.total_amount" type="number" label="Total Amount" outlined />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="formData.details" label="Details" outlined />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input v-model="formData.offer_file" label="Upload Offer File" outlined accept=".pdf,.doc,.docx" />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input v-model="formData.client_logo" label="Upload Client Logo" outlined accept="image/*" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green" @click="$emit('save', formData)">Save</v-btn>
        <v-btn color="grey" @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,   
    offer: Object
  },
  data() {
    return {
      formData: { ...this.offer }
    };
  },
  watch: {
    offer: {
      handler(val) {
        this.formData = { ...val };
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val); 
      }
    }
  }
};
</script>

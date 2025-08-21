<template>
  <v-dialog v-model="dialog" max-width="700px">
    <v-card class="custom-card">
      <v-btn icon class="close-btn" @click="dialog = false">✕</v-btn>

      <v-card-title>
       <span class="headline">
        {{ offer?.id ? "Edit Offer" : "Add New Offer" }}
      </span>

      </v-card-title>

      <v-card-text>        
        <VeeForm
          :validation-schema="schema"
          v-slot="{ errors }"
          @submit="onSubmit"
        >
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <Field name="offer_number" v-slot="{ field }">
                  <v-text-field
                    v-bind="field"
                    label="Offer Number"
                    outlined
                    :error="!!errors.offer_number"
                    :error-messages="errors.offer_number"
                  />
                </Field>
              </v-col>

              <v-col cols="12" md="6">
                <Field name="client_name" v-slot="{ field }">
                  <v-text-field
                    v-bind="field"
                    label="Client Name"
                    outlined
                    :error="!!errors.client_name"
                    :error-messages="errors.client_name"
                  />
                </Field>
              </v-col>

              <v-col cols="12" md="6">
                <Field name="offer_date" v-slot="{ field }">
                  <v-text-field
                    v-bind="field"
                    type="date"
                    label="Offer Date"
                    outlined
                    :error="!!errors.offer_date"
                    :error-messages="errors.offer_date"
                  />
                </Field>
              </v-col>

              <v-col cols="12" md="6">
                <Field name="validity_days" v-slot="{ field }">
                  <v-text-field
                    v-bind="field"
                    type="number"
                    label="Validity (days)"
                    outlined
                    :error="!!errors.validity_days"
                    :error-messages="errors.validity_days"
                  />
                </Field>
              </v-col>

              <v-col cols="12" md="6">
                <Field name="total_amount" v-slot="{ field }">
                  <v-text-field
                    v-bind="field"
                    type="number"
                    label="Total Amount"
                    outlined
                    :error="!!errors.total_amount"
                    :error-messages="errors.total_amount"
                  />
                </Field>
              </v-col>

              <v-col cols="12">
                <Field name="details" v-slot="{ field }">
                  <v-textarea
                    v-bind="field"
                    label="Details"
                    outlined
                    :error="!!errors.details"
                    :error-messages="errors.details"
                  />
                </Field>
              </v-col>

              <v-col cols="12" md="6">
                <Field name="offer_file" v-slot="{ field }">
                  <v-file-input
                    v-bind="field"
                    label="Upload Offer File"
                    outlined
                    accept=".pdf,.doc,.docx"
                    :error="!!errors.offer_file"
                    :error-messages="errors.offer_file"
                  />
                </Field>
              </v-col>

              <v-col cols="12" md="6">
                <Field name="client_logo" v-slot="{ field }">
                  <v-file-input
                    v-bind="field"
                    label="Upload Client Logo"
                    outlined
                    accept="image/*"
                    :error="!!errors.client_logo"
                    :error-messages="errors.client_logo"
                  />
                </Field>
              </v-col>
            </v-row>
          </v-container>

          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" color="green" class="action-btn">Save</v-btn>
            <v-btn color="grey" class="action-btn" @click="dialog = false"
              >Cancel</v-btn
            >
          </v-card-actions>
        </VeeForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { Field } from "vee-validate";
import { Form as VeeForm } from "vee-validate";

import * as Yup from "yup";

// ==========================
// ⚠️ ⚠️ ⚠️ IMPORTANT NOTICE
// THIS COMPONENT ADD OFFERS FROM THE STORE
// JUST FOR CIRCLE INTEGRATION / FRONT-END DEMO
// DATA IS STATIC / MOCKED VIA STORE
// ============================================

//////////import { useOfferStore } from "@/stores/offerStore";//////////////
export default {
  props: {
    modelValue: Boolean,
    offer: Object,
  },
  components: {
    VeeForm,
    Field,
  },
  data() {
    return {
      schema: Yup.object({
        offer_number: Yup.string().required("Offer number is required"),
        client_name: Yup.string().required("Client name is required"),
        offer_date: Yup.date().required("Offer date is required"),
        validity_days: Yup.number()
          .typeError("Must be a number")
          .required("Validity is required")
          .positive("Must be positive"),
        total_amount: Yup.number()
          .typeError("Must be a number")
          .required("Total amount is required")
          .min(1, "Must be at least 1"),
        details: Yup.string().nullable(),
        offer_file: Yup.mixed().nullable(),
        client_logo: Yup.mixed().nullable(),
      }),
    };
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    onSubmit(values) {
      this.$emit("save", values);
    },
  },
};
</script>
<style scoped>
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: red;
  z-index: 10;
}
::v-deep(.v-field__overlay) {
  border: 2px solid #011529;
  border-radius: 10px;
  pointer-events: none;
  background-color: white !important;
}

::v-deep(.v-label) {
  font-weight: normal !important;
}

::v-deep(input::placeholder) {
  font-weight: normal !important;
}
::v-deep(.v-field__outline) {
  display: none !important;
}

::v-deep(.v-field__loader) {
  display: none !important;
}

</style>

<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title>Confirm Deletion</v-card-title>
      <v-card-text>
        Are you sure you want to delete offer {{ offer?.offer_number }}?
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="$emit('confirm', offer)">Delete</v-btn>
        <v-btn color="grey" @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    offer: Object
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

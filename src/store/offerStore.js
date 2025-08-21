import { defineStore } from 'pinia';
import offerService from '../services/offerService';

export const useOfferStore = defineStore('offer', {
  state: () => ({
    offers: [],
    loading: false,
  }),
  actions: {
    async fetchOffers() {
      this.loading = true;
      this.offers = await offerService.getOffers();
      this.loading = false;
    },

    async createOffer(newOffer) {
      this.loading = true;
      const added = await offerService.addOffer(newOffer);
      if (added) {
        this.offers.push(added);
      }
      this.loading = false;
    },
  },
});

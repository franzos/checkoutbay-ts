import { defineStore } from "pinia";
import { ref } from "vue";
import type { PublicShop } from "@gofranz/checkoutbay-common";
import { api, getShopId } from "../services/config";

export const useShopStore = defineStore("shop", () => {
  const shop = ref<PublicShop | null>(null);
  const shopName = ref<string>("Loading ...");
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchShopDetails = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const shopId = getShopId();
      shop.value = await api.getPublicShop(shopId);
      shopName.value = shop.value.name
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to fetch shop details";
      console.error("Failed to fetch shop details:", e);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    shop,
    shopName,
    isLoading,
    error,
    fetchShopDetails,
  };
});

import { Product, CartItem } from "@/lib/shopify/types";

export interface Metafield {
    id: string;
    key: string;
    value: string;
    type: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ExtendedProduct extends Product {
    bookableMetafield?: Metafield | null;
    eventOrServiceChoice?: Metafield | null;
}



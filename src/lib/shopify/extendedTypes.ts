// In a types file (e.g. src/lib/shopify/extendedTypes.ts)
import { Product } from "@/lib/shopify/types";

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

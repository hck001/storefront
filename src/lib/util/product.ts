import { HttpTypes } from "@medusajs/types";

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
    // No options at all
    if (!product.options || product.options.length === 0) return true;
    // All options have only 1 value (nothing to choose)
    return product.options.every((opt) => (opt.values?.length ?? 0) <= 1);
}
import { Dialog, Transition } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"
import { useTranslation } from "@lib/i18n/i18n-context"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  added?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  added,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()
  const { t } = useTranslation()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) return null
    const { variantPrice, cheapestPrice } = price
    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="flex flex-col gap-y-3 justify-center items-center p-4 h-full w-full border-t border-white/10"
            style={{ backgroundColor: "#0a0a0a" }}
            data-testid="mobile-actions"
          >
            <div className="flex items-center gap-x-2 text-white">
              <span data-testid="mobile-title" className="text-sm font-medium">{product.title}</span>
              <span className="text-white/30">—</span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2">
                  {selectedPrice.price_type === "sale" && (
                    <span className="line-through text-white/40 text-xs">
                      {selectedPrice.original_price}
                    </span>
                  )}
                  <span className={clx("text-sm font-medium", {
                    "text-[#C9A84C]": selectedPrice.price_type === "sale",
                  })}>
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : null}
            </div>
            <div className={clx("grid grid-cols-2 w-full gap-x-4", {
              "!grid-cols-1": isSimple
            })}>
              {!isSimple && (
                <button
                  onClick={open}
                  className="w-full py-3 border border-white/20 text-white text-xs uppercase tracking-wider"
                  data-testid="mobile-actions-button"
                >
                  <div className="flex items-center justify-between px-4">
                    <span>
                      {variant ? Object.values(options).join(" / ") : t("product.select")}
                    </span>
                    <ChevronDown />
                  </div>
                </button>
              )}
              <button
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                className="w-full py-3 text-xs tracking-[0.15em] font-bold uppercase disabled:opacity-40 transition-all duration-300"
                style={{ backgroundColor: added ? "#22c55e" : "#C9A84C", color: "#0a0a0a" }}
                data-testid="mobile-cart-button"
              >
                {isAdding ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                ) : added ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t("product.addedToCart")}
                  </span>
                ) : !variant ? t("product.select") : !inStock ? t("product.outOfStock") : t("product.addToCart")}
              </button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3">
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="w-12 h-12 rounded-full text-white flex justify-center items-center"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      <X />
                    </button>
                  </div>
                  <div className="px-6 py-12" style={{ backgroundColor: "#0a0a0a" }}>
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => (
                          <div key={option.id}>
                            <OptionSelect
                              option={option}
                              current={options[option.id]}
                              updateOption={updateOptions}
                              title={option.title ?? ""}
                              disabled={optionsDisabled}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions

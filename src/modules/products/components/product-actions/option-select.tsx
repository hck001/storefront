import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-[11px] uppercase tracking-[0.15em] text-white/40 font-medium">
        {title}
        {current && (
          <span className="text-white/70 ml-2 normal-case tracking-normal">{current}</span>
        )}
      </span>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => (
          <button
            onClick={() => updateOption(option.id, v)}
            key={v}
            className={`min-w-[56px] h-11 px-4 text-sm font-medium border transition-all duration-200 ${
              v === current
                ? "border-[#C9A84C] text-white bg-[#C9A84C]/10"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80 bg-transparent"
            }`}
            disabled={disabled}
            data-testid="option-button"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

export default OptionSelect

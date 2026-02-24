"use client"

import { Label, RadioGroup, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-400">
        {title}
      </span>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange}>
        {items?.map((i) => (
          <div
            key={i.value}
            onClick={() => handleChange(i.value)}
            className={clx(
              "flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-left transition-all duration-200 cursor-pointer",
              i.value === value
                ? "bg-[#0a0a0a] text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            )}
          >
            <div
              className={clx(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                i.value === value
                  ? "border-[#C9A84C] bg-[#C9A84C]"
                  : "border-gray-300"
              )}
            >
              {i.value === value && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <RadioGroup.Item
              checked={i.value === value}
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "text-[13px] font-medium cursor-pointer transition-colors",
                i.value === value ? "text-white" : "text-gray-600"
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup

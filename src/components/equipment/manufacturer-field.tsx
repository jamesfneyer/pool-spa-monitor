"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EquipmentCategory } from "@/lib/data/types";
import {
  getManufacturerSelectValue,
  getManufacturersForCategory,
  isKnownManufacturer,
  MANUFACTURER_OTHER,
  resolveManufacturerForSave,
} from "@/lib/setup/equipment-manufacturers";

const MANUFACTURER_UNSET = "";

interface ManufacturerFieldProps {
  category: EquipmentCategory;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
}

export function ManufacturerField({
  category,
  value,
  onChange,
  id = "manufacturer",
  label = "Manufacturer",
}: ManufacturerFieldProps) {
  const selectValue = getManufacturerSelectValue(category, value);
  const otherText = selectValue === MANUFACTURER_OTHER && !isKnownManufacturer(category, value)
    ? value
    : "";
  const brands = getManufacturersForCategory(category).filter(
    (brand) => brand !== MANUFACTURER_OTHER,
  );

  function handleSelectChange(next: string | null) {
    if (!next || next === MANUFACTURER_UNSET) {
      onChange("");
      return;
    }
    if (next === MANUFACTURER_OTHER) {
      onChange(otherText);
      return;
    }
    onChange(next);
  }

  function handleOtherChange(text: string) {
    onChange(resolveManufacturerForSave(MANUFACTURER_OTHER, text));
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={selectValue} onValueChange={handleSelectChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Choose One" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={MANUFACTURER_UNSET}>Choose One</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))}
          <SelectItem value={MANUFACTURER_OTHER}>{MANUFACTURER_OTHER}</SelectItem>
        </SelectContent>
      </Select>
      {selectValue === MANUFACTURER_OTHER ? (
        <Input
          id={`${id}-other`}
          value={otherText}
          placeholder="Enter manufacturer"
          onChange={(e) => handleOtherChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}

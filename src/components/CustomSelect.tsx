import { Select, SelectProps, ComboboxItem } from "@mantine/core";

interface CustomSelectProps extends Omit<SelectProps, 'value' | "onChange"> {
  value?: number | null;
  onChange?: (value: number | null, option?: Omit<ComboboxItem, "value"> & { value: number }) => void;
}

export default function CustomSelect({ value, onChange, ...rest }: CustomSelectProps) {
    
  const localHandleChange = (value: string | null, option:ComboboxItem) => {
    if (value !== null) {
      onChange?.(Number(value), {label:option.label, value:Number(option.value), disabled:option.disabled});
    } else {
      onChange?.(null);
    }
  };

  return (
    <Select
      value={value !== null ? String(value) : null}
      onChange={(value, option) => localHandleChange(value, option)}  
      {...rest}  
    />
  );
}

 
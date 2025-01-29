import '@mantine/core'
import { isOptionsGroup } from '@mantine/core';
declare module '@mantine/core'{
    export interface ComboboxItem{
        value: string | number;
        label: string;
    };

    // export type ComboboxData = (string | number | ComboboxItem | ComboboxItemGroup<string | number |  ComboboxItem>)[];

    export interface SelectProps{
        value?: string | number | null;
        onChange?:(value: string | number | null) => void;
    }

    // export interface OptionsDropdownProps {
        
    //     value?: string | string[] | number | number[] | null;
    // }

    export type OptionsDropdownProps = {
        value: string | string[] | number | number[] | null; // Allow selected value to be either a string or number
        options: ComboboxItem[]; // The options should also accept both strings and numbers
        onChange: (value: string | number) => void; // onChange should accept both types
    };
}



export function validateOptions(options: any[], valuesSet = new Set()) {
  if (!Array.isArray(options)) {
    return;
  }

  for (const option of options) {
    if (isOptionsGroup(option)) {
      validateOptions(option.items, valuesSet);
    } else {
      if (typeof option.value === 'undefined') {
        throw new Error('[@mantine/core] Each option must have value property');
      }

      if (typeof option.value !== 'string' &&  typeof option.value !== 'number') {
        throw new Error(
          `[@mantine/core] Option value must be a string, other data formats are not supported, got ${typeof option.value}`
        );
      }

      if (valuesSet.has(option.value)) {
        throw new Error(
          `[@mantine/core] Duplicate options are not supported. Option with value "${option.value}" was provided more than once`
        );
      }

      valuesSet.add(option.value);
    }
  }
}

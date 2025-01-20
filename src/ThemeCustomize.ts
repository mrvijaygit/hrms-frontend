
import {Button, Select, Tooltip, Menu, MultiSelect, PasswordInput, TextInput, InputWrapper, NumberInput, Text} from '@mantine/core';
import { MonthPickerInput, DatePickerInput } from '@mantine/dates';

import { VisibilityToggleIcons } from './components/ForTheme';
import customCss from './assets/css/custom.module.css'

// customize theme
export const ThemeModify:any = { 
  fontFamily: 'Roboto, sans-serif',
  focusRing:'never',
  primaryColor:'gold',
  primaryShade: 8,
  lineHeights:1.5,
  scale:1,
  colors:{
    'green':["#eefcf5","#dcf7ea","#b4eed2","#88e5b8","#67dea3","#52d996","#46d78e","#38bf7a","#2da96b","#1b935b"],
    "gold": [
      "#fff9e6",
      "#fcf0d2",
      "#f9e0a4",
      "#f5cf72",
      "#f3c048",
      "#f1b72f",
      "#f0b221",
      "#d69c15",
      "#be8a0b",
      "#a57700"
    ]
    
  },
  components:{
    Button:Button.extend({
      classNames: {
        root: customCss["mantine-Button-root"],
        label: customCss['mantine-Button-label'],
        section: customCss['mantine-Button-section']
      },
      defaultProps:{
        size:"xs",
        variant:"filled"
      }
    }),
    Tooltip:Tooltip.extend({
      classNames: {
        tooltip: customCss["mantine-Tooltip-tooltip"],
      }
    }),
    InputWrapper:InputWrapper.extend({
      classNames: {
        label: customCss["mantine-InputWrapper-label"],
      }
    }),
    Menu:Menu.extend({
      classNames: {
        item: customCss["mantine-Menu-item"],
      }
    }),
    Text:Text.extend({
      defaultProps:{
        fz:'sm',
      }
    }),
    PasswordInput:PasswordInput.extend({
      classNames:{
        visibilityToggle:customCss['mantine-PasswordInput-visibilityToggle']
      },
      defaultProps:{
        placeholder:"Enter",
        visibilityToggleIcon:VisibilityToggleIcons,
      }
    }),
    TextInput:TextInput.extend({
      defaultProps:{
        placeholder:"Enter",
      }
    }),
    NumberInput:NumberInput.extend({
      defaultProps:{
        placeholder:"Enter",
        hideControls:true
      }
    }),
    Select:Select.extend({
      defaultProps:{
        withCheckIcon:false,
        rightSectionWidth:24,
        maxDropdownHeight:200,
        placeholder:"Select",
        allowDeselect:false,
        comboboxProps:{
          dropdownPadding: 0
        }
      },
      classNames:{
        option:customCss['mantine-Select-option'],
        section:customCss['mantine-Select-section'],
        input:customCss['mantine-Select-input'],
      }
    }),
    MultiSelect:MultiSelect.extend({
      defaultProps:{
        withCheckIcon:false,
        rightSectionWidth:24,
        placeholder:"Multi Select",
      },
      classNames:{
        option:customCss['mantine-Select-option'],
        section:customCss['mantine-MultiSelect-section'],
        input:customCss['mantine-MultiSelect-input'],
        pill:customCss['mantine-Pill-label'],
        pillsList:customCss['mantine-MultiSelect-pillsList']
      }
    }),
    DatePickerInput:DatePickerInput.extend({
      defaultProps:{
        allowDeselect:false,
        valueFormat:"DD-MMM-YYYY",
        placeholder:"Pick date",
      }
    }),
    MonthPickerInput:MonthPickerInput.extend({
      defaultProps:{
        allowDeselect:false,
        labelSeparator:'to',
        valueFormat:"MMM-YYYY",
        placeholder:"Pick date range",
      }
    }),
  },
  activeClassName:'',
  headings: {
    sizes: {
      h1: {
        fontSize: '40px',
        lineHeight: 'normal',
        fontWeight: '500',
      },
      h2: {
        fontSize: '32px',
        lineHeight: 'normal',
        fontWeight: '500',
      },
      h3: {
        fontSize: '24px',
        lineHeight: 'normal',
        fontWeight: '500',
      },
      h4: {
        fontSize: '20px',
        lineHeight: 'normal',
        fontWeight: '500',
      },
      h5: {
        fontSize: '16px',
        lineHeight: 'normal',
        fontWeight: '500',
      },
      h6: {
        fontSize: '14px',
        lineHeight: 'normal',
        fontWeight: '500',
      },
    }
  },
  spacing:{
    xl: "48px", lg: "32px", md: "24px", sm: "16px", xs: "8px"
  },
  breakpoints: {
    xs: '400px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  fontSize:{
    xs: '14px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
  container:{
    sizes: {
      xs: 320,
      sm: 540,
      md: 720, 
      lg: 960,
      xl: 1140,
      xxl: 1320, 
    },
  }
};

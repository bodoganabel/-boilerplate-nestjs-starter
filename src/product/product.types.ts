export interface IDropdownOption {
  value: any;
  label: string;
}
export interface IQuotationOptionsResponse {
  productTypes: IDropdownOption[];
  shutters: IDropdownOption[];
  webs: IDropdownOption[];
  cills: IDropdownOption[];
}

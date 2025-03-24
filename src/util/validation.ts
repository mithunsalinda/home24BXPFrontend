export const requiredField = (fieldName: string) => ({
  required: true,
  message: `${fieldName} is required`,
});

export const noSpecialCharRule = {
  pattern: /^[a-zA-Z]*$/,
  message: 'Invalid Input',
};

export const priceValidationRules = [
  requiredField('Price'),
  {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Enter a valid price (up to 2 decimal places)',
  },
];

export const productNameValidationRules = [requiredField('Product Name'), noSpecialCharRule];

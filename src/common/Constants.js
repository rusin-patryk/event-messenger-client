const constants = {
  UNEXPECTED_ERROR: 'An unknown problem has occurred. Please contact the administrator.',
  UNAUTHORIZED: 'Invalid Login or password.',
  EMAIL_NOT_FOUND: 'We did not find such an email in the database.',
  ACCOUNT_LOCKED: 'The account is blocked. Reset your password to unlock it.',
  ACCOUNT_NOT_ACTIVATED: 'The account is inactive. To activate them, go to your email and click the link to activate your account.',
  INVALID_INVOICE_EXTENSION: 'The file type is invalid. Files of the type are allowed: png, jpg, jpeg, jp2, jpx, png, pdf, tif, tiff, raw, bmp.',
  NOT_ALLOWED: 'You are not allowed to access this area.',
};
const findLabelByName = label => constants[label];

export default findLabelByName;

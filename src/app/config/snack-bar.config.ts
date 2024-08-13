export enum SNACKBAR_CLASSES {
  SUCCESS = 'success-snackbar',
  ERROR = 'error-snackbar',
}

export const SNACKBAR_CONFIG = {
  success: {
    duration: 3000,
    panelClass: [SNACKBAR_CLASSES.SUCCESS],
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  },
  error: {
    duration: 3000,
    panelClass: [SNACKBAR_CLASSES.ERROR],
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  },
};

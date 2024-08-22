export enum SNACKBAR_CLASSES {
  SUCCESS = 'success-snackbar',
  ERROR = 'error-snackbar',
}

export enum SNACKBAR_POSITION {
  BOTTOM = 'bottom',
  CENTER = 'center',
  TOP = 'top',
}

export const SNACKBAR_CONFIG = {
  success: {
    duration: 4000,
    panelClass: [SNACKBAR_CLASSES.SUCCESS],
    horizontalPosition: SNACKBAR_POSITION.CENTER,
    verticalPosition: SNACKBAR_POSITION.BOTTOM,
  },
  error: {
    duration: 4000,
    panelClass: [SNACKBAR_CLASSES.ERROR],
    horizontalPosition: SNACKBAR_POSITION.CENTER,
    verticalPosition: SNACKBAR_POSITION.BOTTOM,
  },
};

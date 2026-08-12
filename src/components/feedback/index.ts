/**
 * Public API for the shared feedback / motion / a11y primitives (Story 1.4).
 */
export { ToastProvider, useToast, type ToastOptions } from './ToastProvider';
export { FormTextField, type FormTextFieldProps } from './FormTextField';
export { useReducedMotion, resolveDuration } from './motion';
export {
  idle,
  loading,
  success,
  failure,
  type RequestState,
  type ApiResult,
} from '@/lib/request-state';

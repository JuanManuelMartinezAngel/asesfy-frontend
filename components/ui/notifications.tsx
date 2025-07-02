import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function notify(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'warning':
      toast.warn(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      toast.info(message);
  }
}

export default function Notifications() {
  return <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />;
} 
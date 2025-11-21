import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-2xl" />,
    error: <FaExclamationCircle className="text-2xl" />,
    info: <FaInfoCircle className="text-2xl" />,
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
  };

  return (
    <div className="fixed top-20 right-6 z-50 toast-enter animate-slideInFromTop">
      <div className={`bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px] max-w-md`}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Toast;

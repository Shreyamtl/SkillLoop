export default function LoadingSpinner({ size = 'md', color = 'purple' }) {
    const sizes = {
      sm: 'w-5 h-5 border-2',
      md: 'w-8 h-8 border-3',
      lg: 'w-12 h-12 border-4',
      xl: 'w-16 h-16 border-4',
    };
  
    const colors = {
      purple: 'border-purple-200 border-t-purple-600',
      blue: 'border-blue-200 border-t-blue-600',
      green: 'border-green-200 border-t-green-600',
      white: 'border-white/20 border-t-white',
    };
  
    return (
      <div className="flex justify-center items-center py-8">
        <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}></div>
      </div>
    );
  }
  
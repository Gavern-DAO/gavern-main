const LoadingSpinner = () => (
  <div className="lg:max-w-[1200px] bg-white dark:bg-[#010101] mx-auto rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] py-20 flex items-center justify-center">
    <div className="h-8 w-8 border-4 border-gray-300 border-t-[#010101] rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner
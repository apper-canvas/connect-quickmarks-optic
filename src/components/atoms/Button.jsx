import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 hover:scale-105",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 hover:text-white hover:scale-105",
    ghost: "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:scale-105",
    destructive: "bg-gradient-to-r from-error to-red-700 text-white hover:shadow-lg hover:scale-105"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
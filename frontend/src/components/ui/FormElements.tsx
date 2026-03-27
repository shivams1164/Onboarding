// UI components: Badge, Input, Select, tabs wrapper
import React from "react";

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }
>(({ variant = "default", className = "", ...props }, ref) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-900",
  };
  return (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all resize-none ${className}`}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";

export const Label = React.forwardRef<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement> & { htmlFor?: string }>(
  ({ className = "", ...props }, ref) => (
    <label ref={ref} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props} />
  )
);

Label.displayName = "Label";

export const FormField = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => <div ref={ref} className={`mb-4 ${className}`} {...props} />
);

FormField.displayName = "FormField";

export const FormError = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`text-sm text-red-600 mt-1 ${className}`} {...props} />
  )
);

FormError.displayName = "FormError";

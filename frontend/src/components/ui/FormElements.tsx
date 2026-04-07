// UI components: Badge, Input, Select, tabs wrapper
import React from "react";

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }
>(({ variant = "default", className = "", ...props }, ref) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-100",
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
      className={`w-full min-h-11 px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:disabled:bg-gray-700 ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full min-h-11 px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:disabled:bg-gray-700 ${className}`}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full min-h-11 px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:border-blue-400 dark:disabled:bg-gray-700 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";

export const Label = React.forwardRef<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement> & { htmlFor?: string }>(
  ({ className = "", ...props }, ref) => (
    <label ref={ref} className={`block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300 ${className}`} {...props} />
  )
);

Label.displayName = "Label";

export const FormField = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => <div ref={ref} className={`mb-5 ${className}`} {...props} />
);

FormField.displayName = "FormField";

export const FormError = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`text-sm text-red-600 mt-1 ${className}`} {...props} />
  )
);

FormError.displayName = "FormError";

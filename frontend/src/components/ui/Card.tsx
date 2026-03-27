// UI component: Card
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "flat";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "elevated", className = "", ...props }, ref) => {
    const baseStyles = "rounded-xl p-6";
    const variants = {
      default: "bg-white border border-gray-200",
      elevated: "bg-white shadow-lg shadow-gray-200/50",
      flat: "bg-gray-50",
    };

    return <div ref={ref} className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`mb-4 pb-4 border-b border-gray-200 ${className}`} {...props} />
  )
);

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = "", ...props }, ref) => (
    <h2 ref={ref} className={`text-xl font-semibold text-gray-900 ${className}`} {...props} />
  )
);

CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => <div ref={ref} className={`${className}`} {...props} />
);

CardContent.displayName = "CardContent";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", ...props }, ref) => (
    <p ref={ref} className={`text-sm text-gray-600 ${className}`} {...props} />
  )
);

CardDescription.displayName = "CardDescription";

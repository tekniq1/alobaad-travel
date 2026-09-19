import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-300 outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_12px_36px_var(--shadow-primary)] hover:-translate-y-0.5 hover:bg-primary-bright",
        primary:
          "bg-primary text-primary-foreground shadow-[0_12px_36px_var(--shadow-primary)] hover:-translate-y-0.5 hover:bg-primary-bright",
        glass:
          "border border-glass-border bg-glass text-foreground backdrop-blur-xl hover:bg-glass-strong",
        whatsapp:
          "bg-whatsapp text-whatsapp-foreground shadow-[0_12px_36px_var(--shadow-whatsapp)] hover:-translate-y-0.5 hover:bg-whatsapp-strong",
        ghost: "text-foreground hover:bg-glass-strong",
        outline: "border border-glass-border bg-transparent text-foreground hover:bg-glass-strong",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12",
        sm: "h-10 min-h-10 px-4 text-xs",
        lg: "h-14 px-7 text-base",
        icon: "size-11 min-h-11 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);
Button.displayName = "Button";

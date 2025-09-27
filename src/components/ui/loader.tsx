import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loaderVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        spinner: "animate-spin",
        dots: "gap-2",
        pulse: "animate-pulse",
        bounce: "gap-2",
        wave: "gap-1",
        bars: "gap-2",
        ring: "relative",
        gradient: "relative overflow-hidden",
      },
      size: {
        sm: "w-6 h-6",
        md: "w-8 h-8", 
        lg: "w-12 h-12",
        xl: "w-16 h-16",
        "2xl": "w-20 h-20",
      },
      color: {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        muted: "text-muted-foreground",
        white: "text-white",
        blue: "text-blue-600",
        green: "text-green-600",
        red: "text-red-600",
        yellow: "text-yellow-600",
      }
    },
    defaultVariants: {
      variant: "spinner",
      size: "lg",
      color: "primary",
    },
  }
)

export interface LoaderProps 

  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  text?: string
  fullScreen?: boolean
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, variant, size, color, text, fullScreen, ...props }, ref) => {
    const renderLoader = () => {
      switch (variant) {
        case "spinner":
          return (
            <div className={cn("border-2 border-current border-t-transparent rounded-full", size)} />
          )
        
        case "dots":
          return (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-full bg-current animate-pulse",
                    size === "sm" ? "w-2 h-2" : 
                    size === "md" ? "w-3 h-3" :
                    size === "lg" ? "w-4 h-4" :
                    size === "xl" ? "w-5 h-5" : "w-6 h-6"
                  )}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1s"
                  }}
                />
              ))}
            </div>
          )
        
        case "pulse":
          return (
            <div className={cn("rounded-full bg-current", size)} />
          )
        
        case "bounce":
          return (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-full bg-current animate-bounce",
                    size === "sm" ? "w-2 h-2" : 
                    size === "md" ? "w-3 h-3" :
                    size === "lg" ? "w-4 h-4" :
                    size === "xl" ? "w-5 h-5" : "w-6 h-6"
                  )}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "0.6s"
                  }}
                />
              ))}
            </div>
          )
        
        case "wave":
          return (
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-current rounded-sm animate-pulse",
                    size === "sm" ? "w-1.5 h-6" : 
                    size === "md" ? "w-2 h-8" :
                    size === "lg" ? "w-2 h-10" :
                    size === "xl" ? "w-3 h-12" : "w-3 h-16"
                  )}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "1s"
                  }}
                />
              ))}
            </div>
          )
        
        case "bars":
          return (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-current rounded-sm animate-pulse",
                    size === "sm" ? "w-2 h-6" : 
                    size === "md" ? "w-3 h-8" :
                    size === "lg" ? "w-4 h-10" :
                    size === "xl" ? "w-5 h-12" : "w-6 h-16"
                  )}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1.2s"
                  }}
                />
              ))}
            </div>
          )
        
        case "ring":
          return (
            <div className={cn("relative", size)}>
              <div className={cn("border-2 border-current border-t-transparent rounded-full animate-spin", size)} />
              <div className={cn("absolute inset-0 border-2 border-current/30 border-r-transparent rounded-full animate-spin", size)} 
                   style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
          )
        
        case "gradient":
          return (
            <div className={cn("relative", size)}>
              <div className={cn("border-2 border-transparent border-t-current rounded-full animate-spin", size)} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current/20 to-transparent rounded-full animate-pulse" />
            </div>
          )
        
        default:
          return (
            <div className={cn("border-2 border-current border-t-transparent rounded-full animate-spin", size)} />
          )
      }
    }

    const content = (
      <div
        ref={ref}
        className={cn(loaderVariants({ variant, size, color }), className)}
        {...props}
      >
        {renderLoader()}
      </div>
    )

    if (text) {
      return (
        <div className="flex flex-col items-center gap-3">
          {content}
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {text}
          </p>
        </div>
      )
    }

    return content
  }
)

Loader.displayName = "Loader"

// Full screen loader component
export interface FullScreenLoaderProps extends Omit<LoaderProps, 'fullScreen'> {
  text?: string
  background?: "transparent" | "blur" | "solid"
}

const FullScreenLoader = React.forwardRef<HTMLDivElement, FullScreenLoaderProps>(
  ({ className, background = "solid", text, ...props }, ref) => {
    const backgroundClasses = {
      transparent: "bg-transparent",
      blur: "bg-background/80 backdrop-blur-sm",
      solid: "bg-background"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          backgroundClasses[background],
          className
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader {...props} />
          {text && (
            <p className="text-lg font-medium text-foreground animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }
)

FullScreenLoader.displayName = "FullScreenLoader"

export { Loader, FullScreenLoader, loaderVariants }

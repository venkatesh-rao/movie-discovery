import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface DualRangeSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  formatValue?: (value: number) => string;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, formatValue = (v) => v.toString(), ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
        {formatValue(props.value?.[0] ?? 0)}
      </span>
    </SliderPrimitive.Thumb>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
        {formatValue(props.value?.[1] ?? 10)}
      </span>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
DualRangeSlider.displayName = SliderPrimitive.Root.displayName;

export { DualRangeSlider }; 
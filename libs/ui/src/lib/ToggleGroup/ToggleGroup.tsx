import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';

const toggleGroup = tv({
  slots: {
    root: 'inline-flex items-center justify-center gap-1 rounded-md  p-1',
    item: 'inline-flex items-center justify-center focus:ring-4 ring-primary/50 outline-none ring-offset-0 rounded-lg px-3 py-1.5 text-sm cursor-pointer border border-primary transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
  },
});

const { root, item } = toggleGroup();

const ToggleGroup = ({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root>) => (
  <ToggleGroupPrimitive.Root className={root({ className })} {...props} />
);

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = ({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) => (
  <ToggleGroupPrimitive.Item className={item({ className })} {...props} />
);

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };

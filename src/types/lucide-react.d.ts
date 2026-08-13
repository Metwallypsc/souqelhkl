declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  export type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

  export const ClipboardCheck: LucideIcon;
  export const Leaf: LucideIcon;
  export const PackageCheck: LucideIcon;
  export const Search: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Store: LucideIcon;
}

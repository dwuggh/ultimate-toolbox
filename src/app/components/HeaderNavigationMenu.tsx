import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export default function HeaderNavigationMenu() {
	return (
	<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<NavigationMenu className="transition-colors hover:text-foreground/80 text-foreground/80">
		  <NavigationMenuList>
			<NavigationMenuItem>
			  <Link href="/tactic-board" legacyBehavior passHref>
			  <NavigationMenuLink className={navigationMenuTriggerStyle()}>tactic board</NavigationMenuLink>
			  </Link>
			</NavigationMenuItem>
			<NavigationMenuItem>
			  <Link href="/recap" legacyBehavior passHref>
			  <NavigationMenuLink className={navigationMenuTriggerStyle()}>recap</NavigationMenuLink>
			  </Link>
			</NavigationMenuItem>
		  </NavigationMenuList>
		</NavigationMenu>
	</header>
	)
}
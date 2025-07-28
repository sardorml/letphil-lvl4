import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import { useNavigate } from "react-router";
export function Navigation() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  console.log(userId);

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/login");
  }
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="font-bold text-xl">
                <Link to="/">PollSystem</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="px-4">
                <Link to="/polls">Polls</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="px-4">
                <Link to="/">Create Poll</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {userId ? (
          <div className="ml-auto flex gap-4">
            <Link to="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        ) : (
          <div className="ml-auto flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import AuthButtons from "../components/Authbuttons";
import LogoutButton from "../app/auth/LogoutButton";
import Link from "next/link";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoToCreatePost, GoToProfile, GoToSettings } from "./navButtons";
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarURL?: string;
  bio?: string;
  fullName: string;
  role: string;
}

interface NavbarProps {
  user: User | null;
  isLoggedIn: boolean;
}

const Navbar = ({ user, isLoggedIn }: NavbarProps) => {
  const getInitials = (): string => {
    if (!user) {
      return "GU";
    }
    const firstNameInitial = user.firstName ? user.firstName[0] : "";
    const lastNameInitial = user.lastName ? user.lastName[0] : "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };
  const LoggedinState = () => {
    return (
      <>
        <GoToCreatePost />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className=" size-9 ">
              <AvatarImage className=" select-none" src={user?.avatarURL} />
              <AvatarFallback className=" bg-amber-300 text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className=" md:hidden">
              <Button variant="ghost">Categories</Button>
            </DropdownMenuItem>
            <DropdownMenuItem className=" md:hidden">
              <Button variant="ghost">Authors</Button>{" "}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GoToProfile />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GoToSettings />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className=" flex w-58 p-2 gap-3">
              <Avatar className=" size-9 ">
                <AvatarImage className=" select-none" src={user?.avatarURL} />
                <AvatarFallback className=" bg-amber-300 text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className=" flex flex-col justify-around">
                <span className=" capitalize">{user?.fullName}</span>{" "}
                <small className=" text-gray-400">{user?.email}</small>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  const LoggedOutState = () => {
    return (
      <>
        <AuthButtons />
        <ThemeToggle />
      </>
    );
  };

  return (
    <div>
      <div className=" flex items-center justify-between">
        <div className=" flex gap-8">
          <Link href={"/"} className=" flex md:gap-6 gap-3 items-center">
            <Image
              src="/bloggr.svg"
              width={24}
              height={24}
              alt="app logo"
              className=" inline dark:invert"
            />
            <span className="inline text-xl font-semibold">Bloggr</span>
          </Link>
          <div className=" flex gap-4">
            <Button variant="ghost" className=" md:block hidden">
              Home
            </Button>
            <Button variant="ghost" className=" md:block hidden">
              Categories
            </Button>
            <Button variant="ghost" className=" md:block hidden">
              Authors
            </Button>
            <Input
              placeholder="Search"
              className=" md:w-80 w-40 backdrop-blur-xs lg:block hidden"
            />
            <p>{user?.username}</p>
          </div>
        </div>
        <div className=" flex md:gap-2 gap-1 items-center">
          {user && isLoggedIn ? <LoggedinState /> : <LoggedOutState />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

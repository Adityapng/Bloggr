import { User, Settings, SquarePen } from "lucide-react";
import Link from "next/link";

export function GoToProfile() {
  // const getProfile = () => {
  //   console.log("clicked");
  // };
  return (
    <Link href={`/user/me`} className=" w-full flex px-2.5 py-1.5 items-center">
      <User className="mr-3.5 h-4 w-4" />
      Account
    </Link>
  );
}

export function GoToSettings() {
  return (
    <Link
      href={`/settings`}
      className=" w-full flex px-2.5 py-1.5 items-center"
    >
      <Settings className="mr-3.5 h-4 w-4" />
      Settings
    </Link>
  );
}

export function GoToCreatePost() {
  // const router = useRouter();

  // const getCreatePost = () => {
  //   router.push("/write");
  // };
  return (
    <Link href={`/write`} className=" w-full flex px-2.5 py-1.5 items-center">
      <SquarePen />
      <span>Write</span>
    </Link>
  );
}

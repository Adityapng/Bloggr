import { MessageCircle } from "lucide-react";
import { Input } from "../ui/input";

interface CommentCountProps {
  count: number;
}

export function CommentCount({ count }: CommentCountProps) {
  return (
    <div className=" flex items-center gap-2 cursor-pointer ">
      <MessageCircle />
      <span className="font-medium text-sm">{count}</span>
    </div>
  );
}

// TODO continue with comment section
export function CommentSection({ count }: CommentCountProps) {
  return (
    <>
      <div>
        <span>Comments {`(${count})`}</span>
      </div>
      <div>
        <Input />
      </div>
    </>
  );
}

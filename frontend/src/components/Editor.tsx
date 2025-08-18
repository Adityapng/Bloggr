"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
  const editor = useCreateBlockNote();

  return (
    <div className="w-full flex justify-center">
      <div className=" w-2/5">
        <BlockNoteView editor={editor} className=" h-96" />
        <button
          onClick={() => {
            console.log(editor.document);
          }}
        >
          click
        </button>
      </div>
    </div>
  );
}

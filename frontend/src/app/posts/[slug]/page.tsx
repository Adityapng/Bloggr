import Image from "next/image";

type Blog = {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  commentCount: number;
  likeCount: number;
};
interface PageProps {
  params: { [key: string]: string };
}

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  const { slug } = params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const finalURL = `${apiUrl}/api/posts/${slug}`;

  const response = await fetch(finalURL);

  if (!response.ok) {
    console.error(
      "SERVER responded with an error:",
      response.status,
      response.statusText
    );
    const errorBody = await response.text();
    console.error("SERVER response body:", errorBody.substring(0, 200) + "...");
    throw new Error("Server response was not OK");
  }

  const postData: Blog = await response.json();

  return (
    <div>
      <p>{postData.title}</p>
      <br />
      <Image
        src={postData.coverImage}
        width={800}
        height={400}
        alt={postData.title}
      />
      <br />
      <p>{postData.content}</p>
    </div>
  );
}

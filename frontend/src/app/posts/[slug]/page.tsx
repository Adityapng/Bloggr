import Image from "next/image";

type Blog = {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  commentCount: number;
  likeCount: number;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;
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
      <img src={postData.coverImage} />
      <br />
      <p>{postData.content}</p>
    </div>
  );
}

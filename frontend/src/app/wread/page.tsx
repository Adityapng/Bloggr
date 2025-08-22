import React from "react";
import TiptapRenderer from "../../components/blog/parseHtmlString";

// const json = {
//   type: "doc",
//   content: [
//     {
//       type: "paragraph",
//       attrs: {
//         textAlign: null,
//       },
//       content: [
//         {
//           type: "text",
//           text: "content: 'tempor incididunt ut aliqua lorem incididunt amet adipiscing do sit consectetur consectetur et labore elit ipsum incididunt consectetur tempor aliqua elit et adipiscing lorem magna amet sit sed aliqua labore dolore do magna aliqua sed tempor dolor tempor do lorem aliqua aliqua labore aliqua sed ut labore et consectetur magna ut amet magna adipiscing ipsum dolore dolor",
//         },
//       ],
//     },
//     {
//       type: "bulletList",
//       content: [
//         {
//           type: "listItem",
//           content: [
//             {
//               type: "paragraph",
//               attrs: {
//                 textAlign: null,
//               },
//               content: [
//                 {
//                   type: "text",
//                   text: "elit dolore adipiscing do eiusmod sed ",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: "listItem",
//           content: [
//             {
//               type: "paragraph",
//               attrs: {
//                 textAlign: null,
//               },
//               content: [
//                 {
//                   type: "text",
//                   text: "consectetur sed adipiscing sed sed sed",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: "listItem",
//           content: [
//             {
//               type: "paragraph",
//               attrs: {
//                 textAlign: null,
//               },
//               content: [
//                 {
//                   type: "text",
//                   text: "do tempor do labore amet dolor ut labore",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "paragraph",
//       attrs: {
//         textAlign: null,
//       },
//       content: [
//         {
//           type: "text",
//           text: " sit ut lorem dolor magna sit elit incididunt amet ipsum sit magna lorem elit ut dolor aliqua eiusmod sed elit adipiscing ut et ipsum ut sed sit magna elit do dolore elit sed magna et tempor do magna dolore lorem tempor lorem dolor elit elit lorem dolor dolore magna tempor consectetur amet sed amet do ut adipiscing sed labore dolor sit aliqua eiusmod eiusmod eiusmod do labore amet aliqua ipsum tempor eiusmod sed et et lorem elit consectetur ut aliqua do incididunt amet eiusmod d",
//         },
//       ],
//     },
//     {
//       type: "orderedList",
//       attrs: {
//         start: 1,
//         type: null,
//       },
//       content: [
//         {
//           type: "listItem",
//           content: [
//             {
//               type: "paragraph",
//               attrs: {
//                 textAlign: null,
//               },
//               content: [
//                 {
//                   type: "text",
//                   text: "o magna lorem dolore sit aliqua sit magna sed incididunt a",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: "listItem",
//           content: [
//             {
//               type: "paragraph",
//               attrs: {
//                 textAlign: null,
//               },
//               content: [
//                 {
//                   type: "text",
//                   text: "liqua labore ut incididunt elit et aliqua do dolor do sed elit",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: "listItem",
//           content: [
//             {
//               type: "paragraph",
//               attrs: {
//                 textAlign: null,
//               },
//               content: [
//                 {
//                   type: "text",
//                   text: "eiusmod eiusmod do eiusmod magna magna aliqua aliqua ",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "blockquote",
//       content: [
//         {
//           type: "paragraph",
//           attrs: {
//             textAlign: null,
//           },
//           content: [
//             {
//               type: "text",
//               text: "eiusmod magna ut sed eiusmod consectetur elit labore ipsum lorem dolor eiusmod sit ",
//             },
//             {
//               type: "text",
//               marks: [
//                 {
//                   type: "highlight",
//                   attrs: {
//                     color: "var(--tt-color-highlight-yellow)",
//                   },
//                 },
//               ],
//               text: "eiusmod amet ut ut eiusmod sit dolore incididunt ipsum eiusmod magn",
//             },
//             {
//               type: "text",
//               text: "a dolore lorem adipiscing eiusmod magna eiusmod et et lorem incididunt ",
//             },
//             {
//               type: "text",
//               marks: [
//                 {
//                   type: "strike",
//                 },
//               ],
//               text: "eiusmod sed dolore sit aliqua",
//             },
//             {
//               type: "text",
//               text: " ipsum et amet eiusmod do eiusmod dolor consectetur lorem ut amet lorem do et et elit consectetur dolore aliqua elit et labore lorem et tempor consectetur consectetur elit magna mag",
//             },
//             {
//               type: "text",
//               marks: [
//                 {
//                   type: "underline",
//                 },
//               ],
//               text: "na aliqua do tempor sed magna sit ",
//             },
//             {
//               type: "text",
//               text: "et eiusmod dolor sed labore eiusmod amet adipiscing eiusmod consectetur lorem aliqua incididunt ut consectetur sed labore consectetur labore et dolore labore consectetur et magna adipiscing dolore lorem eiusmod sed incididunt aliqua amet sit ut dolor",
//             },
//             {
//               type: "text",
//               marks: [
//                 {
//                   type: "code",
//                 },
//               ],
//               text: "e amet ipsum sed do sit labore sed ",
//             },
//             {
//               type: "text",
//               text: "tempor dolore lorem tempor adipiscing magna ut et sed lorem lorem et adipiscing et sed consectetur dolore lorem consectetur dolore adipiscing amet dolore",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "paragraph",
//       attrs: {
//         textAlign: "justify",
//       },
//       content: [
//         {
//           type: "text",
//           text: " adipiscing do tempor et labore incididunt elit dolore adipiscing magna ipsum ut tempor aliqua ipsum amet labore incididunt consectetur labore consectetur ipsum do elit ut ipsum eiusmod eiusmod eiusmod sed adipiscing dolore amet incididunt ut et lorem et lorem sit sit sed ipsum consectetur do elit eiusmod consectetur sed magna adipiscing et lorem dolore lorem sed ipsum ut elit sed consectetur aliqua sit adipiscing ipsum tempor sed consectetur aliqua do magna eiusmod magna labore aliqua aliqua magna dolor consectetur incididunt eiusmod amet adipiscing sit lorem ipsum consectetur labore et tempor sed amet lorem labore aliqua adipiscing ut magna ut sed amet et incididunt incididunt sit consectetur do ut ut magna ut aliqua eiusmod magna adipiscing do lorem ipsum adipiscing magna aliqua incididunt lorem adipiscing dolor sed amet amet elit tempor et aliqua amet sed dolore do sed labore aliqua magna dolore ut tempor magna labore labore sed aliqua lorem dolore sed adipiscing adipiscing adipiscing lorem incididunt elit incididunt labore elit incididunt labore sit labore dolor consectetur ipsum et adipiscing aliqua adipiscing ut do sit sit magna magna eiusmod amet adipiscing labore amet adipiscing elit labore dolore do do incididunt ut sed lorem adipiscing lorem sit sed dolor sed do tempor eiusmod adipiscing aliqua et consectetur incididunt lorem sit magna ut sit incididunt magna dolore aliqua dolore do dolore magna dolore aliqua amet magna do do ipsum do tempor amet dolor do sit et consectetur eiusmod labore tempor ut ipsum ipsum sit lorem labore eiusmod adipiscing consectetur lorem ipsum adipiscing ut incididunt magna ipsum tempor consectetur consectetur do dolore aliqua labore tempor eiusmod dolore eiusmod aliqua incididunt amet sed sit labore elit magna elit dolore labore tempor sed sed dolor sit tempor labore magna incididunt ut adipiscing et sit sit ut elit aliqua magna dolor incididunt eiusmod dolor magna et dolor ut adipiscing ipsum elit adipiscing adipiscing labore amet aliqua sed eiusmod ut do ipsum ipsum ipsum ut labore magna amet ut et magna adipiscing dolor dolor incididunt lorem et magna sed adipiscing adipiscing aliqua sit sed amet do dolore et labore aliqua consectetur sed tempor magna eiusmod dolor sed do incididunt dolor elit magna aliqua consectetur lorem amet amet ipsum elit dolor sed labore et aliqua eiusmod tempor elit consectetur amet lorem amet ut labore amet tempor aliqua aliqua tempor aliqua elit sed do incididunt dolor dolor aliqua magna et dolore do elit dolor tempor ipsum do incididunt tempor sit do dolore consectetur dolore sit magna incididunt aliqua ipsum lorem consectetur do labore labore adipiscing amet sed amet amet amet ut dolore sed sed aliqua eiusmod sed labore lorem dolore consectetur sed tempor ut consectetur incididunt et sit ipsum incididunt ipsum tempor sit dolore labore elit ut et adipiscing adipiscing consectetur dolore do eiusmod dolore dolore adipiscing eiusmod aliqua et do ut eiusmod eiusmod dolore tempor dolor lorem labore magna sit amet et aliqua amet tempor ipsum adipiscing eiusmod dolore elit eiusmod ut labore ut adipiscing incididunt elit lorem magna consectetur ut incididunt incididunt elit dolor adipiscing do amet elit dolore adipiscing sit elit ipsum aliqua ut et adipiscing et adipiscing eiusmod eiusmod ut ut magna aliqua eiusmod ut labore elit eiusmod adipiscing elit magna elit tempor aliqua magna sit ut consectetur do magna adipiscing ipsum adipiscing et labore labore tempor consectetur sit eiusmod do amet tempor eiusmod incididunt sit ut ipsum incididunt dolor ut do consectetur eiusmod sed sit adipiscing ipsum sit amet dolore incididunt labore adipiscing et tempor dolore elit do sed aliqua labore adipiscing eiusmod et labore sit elit tempor do dolore dolore ipsum amet adipiscing dolore do aliqua sed eiusmod incididunt labore eiusmod consectetur dolore ipsum incididunt dolor et dolore incididunt adipiscing adipiscing elit magna lorem eiusmod amet dolore dolor elit sit ipsum dolore et amet aliqua labore aliqua sed consectetur dolore tempor elit dolor amet aliqua adipiscing magna consectetur ipsum ipsum consectetur lorem do lorem sit lorem sit adipiscing dolore ipsum ipsum eiusmod amet eiusmod tempor incididunt elit sed sed lorem sed elit elit dolore tempor dolore aliqua tempor amet eiusmod lorem tempor',",
//         },
//       ],
//     },
//     {
//       type: "paragraph",
//       attrs: {
//         textAlign: null,
//       },
//     },
//   ],
// };

const App = () => {
  const str = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [
          {
            type: "text",
            text: "content: 'tempor incididunt ut aliqua lorem incididunt amet adipiscing do sit consectetur consectetur et labore elit ipsum incididunt consectetur tempor aliqua elit et adipiscing lorem magna amet sit sed aliqua labore dolore do magna aliqua sed tempor dolor tempor do lorem aliqua aliqua labore aliqua sed ut labore et consectetur magna ut amet magna adipiscing ipsum dolore dolor elit dolore adipiscing do eiusmod sed consectetur sed adipiscing sed sed sed do tempor do labore amet dolor ut labore sit ut lorem dolor magna sit elit incididunt amet ipsum sit magna lorem elit ut dolor aliqua eiusmod sed elit adipiscing ut et ipsum ut sed sit magna elit do dolore elit sed magna et tempor do magna dolore lorem tempor lorem dolor elit elit lorem dolor dolore magna tempor consectetur amet sed ",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [{ type: "text", text: "1st" }],
      },
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/dm9jqz1pv/image/upload/v1755845976/blog_post_images/bfivv6knfcdt1kaxveb4.png",
          alt: "Screenshot from 2025-08-10 05-51-13",
          title: "Screenshot from 2025-08-10 05-51-13",
          width: null,
          height: null,
        },
      },
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [
          {
            type: "text",
            text: "amet do ut adipiscing sed labore dolor sit aliqua eiusmod eiusmod eiusmod do labore amet aliqua ipsum tempor eiusmod sed et et lorem elit consectetur ut aliqua do incididunt amet eiusmod do magna lorem dolore sit aliqua sit magna sed incididunt aliqua labore ut incididunt elit et aliqua do dolor do sed elit eiusmod eiusmod do eiusmod magna magna aliqua aliqua eiusmod magna ut sed eiusmod consectetur elit labore ipsum lorem dolor eiusmod sit eiusmod amet ut ut eiusmod sit dolore incididunt ipsum eiusmod magna dolore lorem adipiscing eiusmod magna eiusmod et et lorem incididunt eiusmod sed dolore sit aliqua ipsum et amet eiusmod do eiusmod dolor consectetur lorem ut amet lorem do et et elit consectetur dolore aliqua elit et labore lorem et tempor consectetur consectetur elit magna magna aliqua do tempor sed magna sit et eiusmod dolor sed labore eiusmod amet adipiscing eiusmod consectetur lorem aliqua incididunt ut consectetur sed labore consectetur labore et dolore labore consectetur et magna adipiscing dolore lorem eiusmod sed incididunt ",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [{ type: "text", text: "2nd" }],
      },
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/dm9jqz1pv/image/upload/v1755846006/blog_post_images/ah8ygz0aanwpk0ewzsl0.png",
          alt: "Screenshot from 2025-08-10 05-48-27",
          title: "Screenshot from 2025-08-10 05-48-27",
          width: null,
          height: null,
        },
      },
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [
          {
            type: "text",
            text: "aliqua amet sit ut dolore amet ipsum sed do sit labore sed tempor dolore lorem tempor adipiscing magna ut et sed lorem lorem et adipiscing et sed consectetur dolore lorem consectetur dolore adipiscing amet dolore adipiscing do tempor et labore incididunt elit dolore adipiscing magna ipsum ut tempor aliqua ipsum amet labore incididunt consectetur labore consectetur ipsum do elit ut ipsum eiusmod eiusmod eiusmod sed adipiscing dolore amet incididunt ut et lorem et lorem sit sit sed ipsum consectetur do elit eiusmod consectetur sed magna adipiscing et lorem dolore lorem sed ipsum ut elit sed consectetur aliqua sit adipiscing ipsum tempor sed consectetur aliqua do magna eiusmod magna labore aliqua aliqua magna dolor consectetur incididunt eiusmod amet adipiscing sit lorem ipsum consectetur labore et tempor sed amet lorem labore aliqua adipiscing ut magna ut sed amet et incididunt incididunt sit consectetur do ut ut magna ut aliqua eiusmod magna adipiscing do lorem ipsum adipiscing magna aliqua incididunt lorem adipiscing dolor sed amet amet elit tempor et aliqua amet sed dolore do sed labore aliqua magna dolore ut tempor magna labore labore sed aliqua lorem dolore sed adipiscing adipiscing adipiscing lorem incididunt elit incididunt labore elit incididunt labore sit labore dolor consectetur ipsum et adipiscing aliqua adipiscing ut do sit sit magna magna eiusmod amet adipiscing labore amet adipiscing elit labore dolore do do incididunt ut sed lorem adipiscing lorem sit sed dolor sed do tempor eiusmod adipiscing aliqua et consectetur incididunt lorem sit magna ut sit incididunt magna dolore aliqua dolore do dolore magna dolore aliqua amet magna do do ipsum do tempor amet dolor do sit et consectetur eiusmod labore tempor ut ipsum ipsum sit lorem labore eiusmod adipiscing consectetur lorem ipsum adipiscing ut incididunt magna ipsum tempor consectetur consectetur do dolore aliqua labore tempor eiusmod dolore eiusmod aliqua incididunt amet sed sit labore elit magna elit dolore labore tempor sed sed dolor sit tempor labore magna incididunt ut adipiscing et sit sit ut elit aliqua magna dolor incididunt eiusmod dolor magna et dolor ut adipiscing ipsum elit adipiscing adipiscing labore amet aliqua sed eiusmod ut do ipsum ipsum ipsum ut labore magna amet ut et magna adip",
          },
        ],
      },
      {
        type: "image",
        attrs: {
          src: "https://res.cloudinary.com/dm9jqz1pv/image/upload/v1755846048/blog_post_images/uyahg2dswtwrnbwzfrpl.png",
          alt: "Screenshot from 2025-08-10 15-04-03",
          title: "Screenshot from 2025-08-10 15-04-03",
          width: null,
          height: null,
        },
      },
      {
        type: "paragraph",
        attrs: { textAlign: null },
        content: [
          {
            type: "text",
            text: "iscing dolor dolor incididunt lorem et magna sed adipiscing adipiscing aliqua sit sed amet do dolore et labore aliqua consectetur sed tempor magna eiusmod dolor sed do incididunt dolor elit magna aliqua consectetur lorem amet amet ipsum elit dolor sed labore et aliqua eiusmod tempor elit consectetur amet lorem amet ut labore amet tempor aliqua aliqua tempor aliqua elit sed do incididunt dolor dolor aliqua magna et dolore do elit dolor tempor ipsum do incididunt tempor sit do dolore consectetur dolore sit magna incididunt aliqua ipsum lorem consectetur do labore labore adipiscing amet sed amet amet amet ut dolore sed sed aliqua eiusmod sed labore lorem dolore consectetur sed tempor ut consectetur incididunt et sit ipsum incididunt ipsum tempor sit dolore labore elit ut et adipiscing adipiscing consectetur dolore do eiusmod dolore dolore adipiscing eiusmod aliqua et do ut eiusmod eiusmod dolore tempor dolor lorem labore magna sit amet et aliqua amet tempor ipsum adipiscing eiusmod dolore elit eiusmod ut labore ut adipiscing incididunt elit lorem magna consectetur ut incididunt incididunt elit dolor adipiscing do amet elit dolore adipiscing sit elit ipsum aliqua ut et adipiscing et adipiscing eiusmod eiusmod ut ut magna aliqua eiusmod ut labore elit eiusmod adipiscing elit magna elit tempor aliqua magna sit ut consectetur do magna adipiscing ipsum adipiscing et labore labore tempor consectetur sit eiusmod do amet tempor eiusmod incididunt sit ut ipsum incididunt dolor ut do consectetur eiusmod sed sit adipiscing ipsum sit amet dolore incididunt labore adipiscing et tempor dolore elit do sed aliqua labore adipiscing eiusmod et labore sit elit tempor do dolore dolore ipsum amet adipiscing dolore do aliqua sed eiusmod incididunt labore eiusmod consectetur dolore ipsum incididunt dolor et dolore incididunt adipiscing adipiscing elit magna lorem eiusmod amet dolore dolor elit sit ipsum dolore et amet aliqua labore aliqua sed consectetur dolore tempor elit dolor amet aliqua adipiscing magna consectetur ipsum ipsum consectetur lorem do lorem sit lorem sit adipiscing dolore ipsum ipsum eiusmod amet eiusmod tempor incididunt elit sed sed lorem sed elit elit dolore tempor dolore aliqua tempor amet eiusmod lorem tempor',",
          },
        ],
      },
    ],
  };
  const stringCont = JSON.stringify(str);
  console.log(typeof str);
  console.log(typeof stringCont);

  return (
    <div className=" w-full flex justify-center">
      <div className=" w-2/5">
        <h1 className=" text-5xl">Sample Post Title 19</h1>
        <TiptapRenderer content={stringCont} />
      </div>
    </div>
  );
};

export default App;

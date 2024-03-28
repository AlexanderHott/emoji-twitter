import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};
// const font = fetch(new URL("/public/impact.ttf", import.meta.url)).then((res) =>
//   res.arrayBuffer()
// );

export default function handle() {
  //   const fontData = await font;
  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col justify-around items-center bg-black">
        <div tw="text-white text-7xl font-extrabold">Emoji Twitter</div>
        <div tw="text-9xl">🗿</div>
        <div tw="text-white text-7xl font-extrabold">BOTTOM TEXT</div>
      </div>
    ),
    // (
    //   // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
    //   <div
    //     style={{
    //       height: "100%",
    //       width: "100%",
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       backgroundColor: "white",
    //     }}
    //   >
    //     <div tw="bg-gray-50 flex">
    //       <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
    //         <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
    //           <span>Ready to dive in?</span>
    //           <span tw="text-indigo-600">Start your free trial today.</span>
    //         </h2>
    //         <div tw="mt-8 flex md:mt-0">
    //           <div tw="flex rounded-md shadow">
    //             <a
    //               href="#"
    //               tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white"
    //             >
    //               Get started
    //             </a>
    //           </div>
    //           <div tw="ml-3 flex rounded-md shadow">
    //             <a
    //               href="#"
    //               tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600"
    //             >
    //               Learn more
    //             </a>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // ),
    {
      width: 1200,
      height: 630,
      //   fonts: [{ name: "Impact", data: fontData, style: "normal" }],
    }
  );
}

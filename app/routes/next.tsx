import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix JS Brasil" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Remix() {
  return (
    <>
      <div className="bg-black h-screen py-32">
        <img className="mx-auto " src="/img/rmx.png" alt="" />
      </div>
    </>
  );
}

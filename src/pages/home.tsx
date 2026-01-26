import Card from "../components/card";
import { MdOutlineDevices } from "react-icons/md";
import { GiClothes } from "react-icons/gi";
import { GiLipstick } from "react-icons/gi";
import { GiSofa } from "react-icons/gi";

export default function Home() {
  return (
    <>
      <section className="w-screen relative">
        <div className="w-full h-[80vh] py-4 flex justify-center items-center">
          <aside className="w-1/2 text-gray-900 px-10">
            <h1 className="text-6xl font-semibold leading-tight">
              Your <span className="text-8xl underline"> everyday </span>
              <span className="block text-purple-500">shopping</span>
              <span> experience, </span>
              <span className="text-8xl underline">simplified</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 bg-gray-100 rounded-lg px-4 py-2 w-fit">
              Discover quality products, manage orders seamlessly, and shop with
              confidence
            </p>
          </aside>

          <aside className="w-1/2 h-full">
            <div className="w-3/4 p-6 h-full bg-gray-200 mx-auto rounded-4xl">
              <img
                src="/hero2.png"
                alt="Hero Image"
                className="w-full h-full mx-auto rounded-4xl"
              />
            </div>
          </aside>
        </div>

        <div className="flex flex-col items-center my-16 gap-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Product Categories
          </h1>
          <div className="grid grid-cols-4 gap-8 my-12">
          <Card title="Fashion" description={
            <>
          Discover a refined collection of apparel,
          <br />
          footwear, and accessories crafted with
          <br />
          attention to quality, comfort,
          <br />
          and timeless design. Ideal for everyday
          <br />
          wear and evolving lifestyles.
            </>
          } icon={
            <GiClothes size={60} className="text-gray-900"/>
          }/>
          <Card title="Electronics" description={
            <>
          Discover carefully selected electronic
          <br />
          devices and accessories that combine
          <br />
          modern technology with dependable
          <br />
          performance and thoughtful design.
          </>
         } icon={
          <MdOutlineDevices size={60} className="text-gray-900"/>
         }/>
          <Card title="Beauty & Personal Care" description={
            <>
          Discover beauty and personal care
          <br />
          essentials created to maintain comfort,
          <br />
          confidence, and well-being through
          <br />
          reliable formulations and practical
          <br />
          design
            </>
          }
          icon={
            <GiLipstick size={60} className="text-gray-900"/>
          }/>
          <Card title="Home & Living" description={
            <>
            Browse thoughtfully selected home
            <br />
            and living products that combine
            <br />
            refined design with reliable materials
            <br />
            for everyday use.
            </>
          }
          icon={
            <GiSofa size={60} className="text-gray-900"/>
          }/>
          </div>
        </div>
      </section>
    </>
  );
}

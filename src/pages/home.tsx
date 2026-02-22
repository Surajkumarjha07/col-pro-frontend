import Card from "../components/card";
import { MdOutlineDevices } from "react-icons/md";
import { GiClothes, GiLipstick, GiSofa } from "react-icons/gi";

export default function Home() {
  const trustItems = [
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "Free delivery on all orders above ₹499",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "Your transactions are safe and encrypted",
    },
    {
      icon: "🔄",
      title: "Easy Returns",
      description: "Hassle-free returns within 7 days",
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "We are here to help anytime",
    },
  ];

  return (
    <section className="w-full overflow-x-hidden">
      <div className="w-full min-h-[70vh] lg:h-[80vh] py-8 flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-0 px-4 sm:px-8 lg:px-0">
        <aside className="w-full lg:w-1/2 text-gray-900 px-4 sm:px-6 lg:px-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
            Your{" "}
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl underline">
              everyday
            </span>{" "}
            <span className="block text-purple-500">shopping</span>{" "}
            <span> experience, </span>{" "}
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl underline">
              simplified
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-600 bg-gray-100 rounded-lg px-4 py-2 w-fit">
            Discover quality products, manage orders seamlessly, and shop with
            confidence
          </p>
        </aside>

        <aside className="w-full lg:w-1/2 h-full">
          <div className="w-full sm:w-4/5 lg:w-3/4 p-4 sm:p-6 h-full bg-gray-200 mx-auto rounded-3xl">
            <img
              src="/hero2.png"
              alt="Hero Image"
              className="w-full h-full rounded-3xl"
            />
          </div>
        </aside>
      </div>

      <div className="flex flex-col items-center my-16 gap-4 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center">
          Product Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-12 w-full max-w-7xl">
          <Card
            title="Fashion"
            description={
              <>
                Discover a refined collection of apparel,
                <br />
                footwear, and accessories crafted with
                <br />
                attention to quality, comfort,
                <br />
                and timeless design.
              </>
            }
            icon={<GiClothes size={60} className="text-gray-900 mx-auto" />}
          />

          <Card
            title="Electronics"
            description={
              <>
                Discover carefully selected electronic
                <br />
                devices and accessories that combine
                <br />
                modern technology with dependable
                <br />
                performance.
              </>
            }
            icon={
              <MdOutlineDevices size={60} className="text-gray-900 mx-auto" />
            }
          />

          <Card
            title="Beauty & Personal Care"
            description={
              <>
                Discover beauty and personal care
                <br />
                essentials created to maintain comfort,
                <br />
                confidence, and well-being.
              </>
            }
            icon={<GiLipstick size={60} className="text-gray-900 mx-auto" />}
          />

          <Card
            title="Home & Living"
            description={
              <>
                Browse thoughtfully selected home
                <br />
                and living products that combine
                <br />
                refined design with reliable materials.
              </>
            }
            icon={<GiSofa size={60} className="text-gray-900 mx-auto" />}
          />
        </div>
      </div>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-10">
            Why Shop With Us?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center"
              >
                <div className="text-3xl sm:text-4xl mb-4">{item.icon}</div>
                <h3 className="text-base sm:text-lg font-medium mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

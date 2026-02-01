export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          About E-Marketplace
        </h1>
        <p className="mt-3 text-gray-600">
          A modern e-commerce platform connecting sellers and buyers in one
          seamless marketplace.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        {/* Section 1 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            What is E-Marketplace?
          </h2>
          <p className="leading-relaxed text-gray-600">
            E-Marketplace is an online e-commerce platform where sellers can
            list and manage their products, and users can browse, purchase,
            and pay securely. The platform is designed to simplify online
            selling while providing buyers with a smooth and reliable shopping
            experience.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            For Sellers
          </h2>
          <p className="leading-relaxed text-gray-600">
            Sellers on E-Marketplace have full control over their product
            listings. They can add, update, and manage products directly from
            their dashboard. Product management features are exclusively
            available to sellers to ensure data integrity and platform
            security.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            For Buyers
          </h2>
          <p className="leading-relaxed text-gray-600">
            Buyers can explore products listed by different sellers, add items
            to their cart, and complete purchases securely. The platform
            focuses on ease of use, transparent pricing, and a smooth checkout
            process.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Secure Payments
          </h2>
          <p className="leading-relaxed text-gray-600">
            All payments on E-Marketplace are processed through the Razorpay
            payment gateway. This ensures fast, secure, and reliable
            transactions while supporting multiple payment methods commonly
            used by customers.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Our Goal
          </h2>
          <p className="leading-relaxed text-gray-600">
            Our goal is to build a trustworthy and scalable marketplace that
            empowers sellers to grow their business and provides buyers with a
            convenient and secure shopping experience.
          </p>
        </section>
      </div>
    </div>
  );
}

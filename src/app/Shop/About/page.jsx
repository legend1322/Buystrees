'use client';

export default function AbouttPage() {


  return (
    <div className="min-h-screen" >
            <section id="about" className="scroll-smooth bg-green-50 py-16 px-4 sm:px-6 lg:px-20">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-green-800 mb-6">🌱 About BuyTrees</h2>
            <p className="text-lg text-gray-700 mb-4">
              At <strong>BuyTrees</strong>, we believe in reconnecting people with nature—one product at a time.
              Our mission is to support local gardeners, plant lovers, and eco-conscious individuals by offering
              a curated selection of <span className="font-medium text-green-700">plants</span>,
              <span className="font-medium text-green-700"> gardening tools</span>,
              <span className="font-medium text-green-700"> pots</span>, and
              <span className="font-medium text-green-700"> organic fertilizers</span>.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Rooted in sustainability and simplicity, we partner with trusted local sellers to ensure every
              product you find here is not only high-quality but also responsibly sourced.
              Whether you're a beginner nurturing your first sapling or a seasoned gardener expanding your green haven,
              <strong> BuyTrees</strong> is your go-to marketplace for all things green.
            </p>
            <div className="mt-8 text-left max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">🌿 Why Choose BuyTrees?</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>✔️ Handpicked products by trusted sellers</li>
                <li>✔️ Easy-to-use seller dashboard for seamless product management</li>
                <li>✔️ Eco-friendly packaging & sustainable choices</li>
                <li>✔️ Supporting local businesses & green lifestyles</li>
              </ul>
            </div>
            <p className="mt-10 text-xl font-medium text-green-800">Let’s grow something beautiful—together. 🌳</p>
          </div>
      </section>

    </div>
  );
}

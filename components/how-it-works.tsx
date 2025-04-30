export default function HowItWorks() {
  const steps = [
    {
      title: "Project Registration",
      description:
        "After connecting your wallet, register your NFT project's basic information and contract address.",
      forSeller: true,
    },
    {
      title: "AI Report Generation",
      description:
        "An automated report is generated with project valuation, transaction history, and community analysis.",
      forSeller: true,
    },
    {
      title: "Listing",
      description:
        "Set your desired price and list your project on the marketplace.",
      forSeller: true,
    },
    {
      title: "Project Search",
      description: "Filter by category, name, and more to find the perfect IP.",
      forSeller: false,
    },
    {
      title: "Detailed Report Review",
      description:
        "Evaluate the project's value and potential using the AI-generated detailed report.",
      forSeller: false,
    },
    {
      title: "Purchase & Rights Transfer",
      description:
        "Pay with USDC and receive smart contract ownership rights on the blockchain.",
      forSeller: false,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Complete IP buying and selling in simple steps on the NFT IP
            Marketplace
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-rose-500">For Sellers</h3>
            {steps
              .filter((step) => step.forSeller)
              .map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="font-bold text-rose-500">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-teal-500">For Buyers</h3>
            {steps
              .filter((step) => !step.forSeller)
              .map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="font-bold text-teal-500">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

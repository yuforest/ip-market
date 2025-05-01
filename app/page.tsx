import FeaturedProjects from "@/components/featured-projects";
import HowItWorks from "@/components/how-it-works";
import { Button } from "@/components/ui/button";
import { NftProject } from "@/lib/db/schema";
import { ArrowRight, RefreshCw, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export async function getProjects() {
  const queryParams = new URLSearchParams();

  queryParams.set("limit", "1");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get projects: ${response.statusText}`);
  }

  return response.json();
}

export default async function HomePage() {
  const res = await getProjects();
  const projects = res.projects as NftProject[];
  console.log(projects);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-100 to-teal-100 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Buy and Sell
                <br />
                Entire NFT Collections
              </h1>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                IP ownership can be bought and sold through smart contracts.
                Secure, one-stop, easy transactions on the blockchain.
                <br /> AI-based valuation of NFT collections allows both sellers
                and buyers to make transactions at acceptable rates.
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-rose-500 hover:bg-rose-600"
                >
                  <Link href="/user/projects/new">
                    List Your NFT Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/projects">Explore Projects</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-teal-200 rounded-2xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img
                    src={
                      projects[0]?.image || "https://placeholder.pics/svg/500"
                    }
                    alt="NFT IP Market"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-rose-100">
                <Sparkles className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold">Value for Sellers</h3>
              <p className="text-gray-500">
                Sell your IP with just a wallet signature. Get instant
                AI-powered valuation for fair pricing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-teal-100">
                <Shield className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold">Value for Buyers</h3>
              <p className="text-gray-500">
                Acquire IPs with established fan bases. Leverage existing
                communities, social media, and NFT holders.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-blue-100">
                <RefreshCw className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Investors & Community</h3>
              <p className="text-gray-500">
                IP remains active even with new owners. Enhance NFT secondary
                value with transparent governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* How It Works */}
      <HowItWorks />
    </div>
  );
}

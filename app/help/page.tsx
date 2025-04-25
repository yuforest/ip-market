import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  // Frequently asked questions
  const faqs = [
    {
      question: "What is the NFT IP Market?",
      answer:
        "NFT IP Market is a marketplace where you can buy and sell entire NFT collections (digital IP) securely and in one stop. The key feature is the ability to transfer IP, community, and smart contract management rights all at once.",
    },
    {
      question: "How do I register a project?",
      answer:
        "You can register your NFT project from the Project Registration page by entering basic information (name, description, contract address, etc.). You must be the owner of the smart contract to register.",
    },
    {
      question: "How is the project price determined?",
      answer:\
        "Project pricing is based on AI-powered automatic valuation and the seller's desired price. The evaluation considers past transaction volume, number of holders, community activity, and other factors.
    },
    {
      question: "How does the rights transfer work after purchase?",
      answer:
        "Once a purchase is completed, the smart contract ownership rights are transferred on the blockchain. This transfers IP ownership, community management rights, and royalty settings to the buyer.",
    },
    {
      question: "What are the fees?",
      answer: "We charge a 3% fee to the seller when a transaction is completed. There are no registration fees or monthly charges.",
    },
  ]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find answers to common questions and learn how to use the NFT IP Market
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search for questions..." className="pl-10 max-w-xl mx-auto" />
        </div>

        <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>
          <TabsContent value="faq" className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="guides" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Seller Guide</CardTitle>
                  <CardDescription>How to list your NFT project</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    <li>Project registration process</li>
                    <li>Understanding AI reports</li>
                    <li>Setting the right price</li>
                    <li>Managing your listings</li>
                  </ul>
                  <Button className="mt-4 w-full">View Guide</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Buyer Guide</CardTitle>
                  <CardDescription>How to purchase NFT projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    <li>Finding the right project</li>
                    <li>Reading valuation reports</li>
                    <li>Purchase process</li>
                    <li>Post-purchase management</li>
                  </ul>
                  <Button className="mt-4 w-full">View Guide</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>If you have any questions or concerns, please feel free to contact us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <Mail className="h-6 w-6 text-rose-500" />
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      <Link href="mailto:support@nftipmarket.com" className="text-rose-500 text-sm mt-1 inline-block">
                        support@nftipmarket.com
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border">
                    <MessageSquare className="h-6 w-6 text-rose-500" />
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-sm text-gray-500">Available weekdays 10:00-18:00</p>
                      <Button variant="link" className="text-rose-500 p-0 h-auto text-sm">
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="example@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Subject of your inquiry" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Please enter your message"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
                  </div>
                  <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

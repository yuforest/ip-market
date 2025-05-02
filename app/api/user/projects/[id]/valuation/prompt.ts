import { NftProject, ProjectDisclosure } from "@/lib/db/schema";

export const getValuationPrompt = (project: NftProject & { disclosures: ProjectDisclosure[] }) => `Please analyze this NFT project and provide a valuation:
Name: ${project.name}
Collection Address: ${project.collectionAddress}
Description: ${project.description}
Category: ${project.category}
Chain: ${project.chainId}
Last 12 Months Revenue: ${project.ltmRevenueUSD || "N/A"}
Disclosures: ${project.disclosures?.map(disclosure => `${disclosure.disclosureType}: ${disclosure.title}`).join("\n") || "N/A"}

Please provide:
Please prepare a detailed report evaluating the investment value of the following NFT projects.
Please summarize the entire report in 3,000-4,000 words in English and output in Markdown format.
Please include the following items

1. Project Summary.
   - Objective/vision, major NFT collections, chains, number of issues  
2. Market Environment/Competitive Analysis  
   - Comparison with 2-3 similar projects (size, use cases, market valuation)  
3. Demand-side indicators  
   - On-chain data including primary/secondary distribution volume, number of holders, resale rate, average holding period, etc.  
4. Supply-side indicators  
   - Total supply, release schedule, burn/staking availability  
5. Team and community analysis  
   - Core member biographies, community size (Discord / X followers), engagement metrics  
6. Talknomics & Cash Flow  
   - Loyalty rates, operating revenue sources, use of funds, treasury balance  
7. Development Progress & Roadmap  
   - Past milestones achieved and planned for the next 6-12 months  
8. Risk Factors.  
   - Regulations, market volatility, dependent platforms, smart contract vulnerabilities  
9. Valuation Methodology and Estimates (1) DCF (Discounted Cash Flow)  
   - (i) DCF (discounted future royalties), (ii) Relative value (similar collection multiples), (iii) On-chain indicators (e.g., NVT)  
   - Assumptions for each method, sensitivity analysis, and valuation by range  
10. final valuation at USDC

The response should be a JSON object like below.
Not include any other text or formatting like \`\`\`json or \`\`\`

{
  "estimatedValueUSD": 1000000,
  "report": "This NFT project is worth 1 million USDC."
}
`; 
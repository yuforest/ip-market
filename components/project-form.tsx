"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowRight, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export type ProjectFormData = {
  name: string;
  collectionAddress: string;
  chainId: string;
  description: string;
  image?: string;
  category: string;
  royaltyPct: string;
  ltmRevenueUSD: string;
  metadataCID: string;
  disclosures: {
    disclosureType: string;
    title: string;
    description: string;
  }[];
};

type ProjectFormProps = {
  initialData?: ProjectFormData;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isEditing?: boolean;
};

export function ProjectForm({
  initialData,
  onSubmit,
  isEditing = false,
}: ProjectFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>(
    initialData || {
      name: "",
      collectionAddress: "",
      chainId: "",
      image: "",
      description: "",
      category: "",
      royaltyPct: "",
      ltmRevenueUSD: "",
      metadataCID: "",
      disclosures: [
        {
          disclosureType: "",
          title: "",
          description: "",
        },
      ],
    }
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addDisclosure = () => {
    setFormData((prev) => ({
      ...prev,
      disclosures: [
        ...prev.disclosures,
        {
          disclosureType: "",
          title: "",
          description: "",
        },
      ],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImagePreview(event.target.result);
          setFormData({
            ...formData,
            image: event.target.result,
          });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit NFT Project" : "Register NFT Project"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing
            ? "Update your project information"
            : "List your NFT project on the marketplace"}
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          To {isEditing ? "update" : "register"} a project, you must be the
          owner of the smart contract. Ownership verification will be performed
          after wallet connection.
        </AlertDescription>
      </Alert>

      <div className="mb-8">
        <div className="relative">
          <div className="flex items-center justify-between">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    step >= i
                      ? "bg-rose-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i}
                </div>
                <span className="mt-2 text-xs text-gray-500">
                  {i === 1 ? "Basic Info" : "Disclosures"}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-0 right-0 h-[2px] -z-10">
              <div className="h-full bg-gray-200">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${((step - 1) / 1) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Project Basic Information" : "Project Disclosures"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Enter the basic information about your project"
              : "Add any additional disclosures about your project (optional)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectImage">Project Image</Label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2 inline-block" />
                      <span>アップロード</span>
                      <Input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <div className="relative w-24 h-24 overflow-hidden rounded-md">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionAddress">
                    Collection Address *
                  </Label>
                  <Input
                    id="collectionAddress"
                    value={formData.collectionAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collectionAddress: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chainId">Chain ID *</Label>
                  <Select
                    value={formData.chainId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, chainId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1868">Soneium Minato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="PFP">PFP</SelectItem>
                      <SelectItem value="Game">Game</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="royaltyPct">Royalty Percentage</Label>
                  <Input
                    id="royaltyPct"
                    type="number"
                    value={formData.royaltyPct}
                    onChange={(e) =>
                      setFormData({ ...formData, royaltyPct: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ltmRevenueUSD">LTM Revenue (USD)</Label>
                  <Input
                    id="ltmRevenueUSD"
                    type="number"
                    value={formData.ltmRevenueUSD}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ltmRevenueUSD: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metadataCID">Metadata CID</Label>
                  <Input
                    id="metadataCID"
                    value={formData.metadataCID}
                    onChange={(e) =>
                      setFormData({ ...formData, metadataCID: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {formData.disclosures.map((disclosure, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="space-y-2">
                      <Label>Disclosure Type</Label>
                      <Select
                        value={disclosure.disclosureType}
                        onValueChange={(value) => {
                          const newDisclosures = [...formData.disclosures];
                          newDisclosures[index].disclosureType = value;
                          setFormData({
                            ...formData,
                            disclosures: newDisclosures,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="license">License</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                          <SelectItem value="tokenomics">Tokenomics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={disclosure.title}
                        onChange={(e) => {
                          const newDisclosures = [...formData.disclosures];
                          newDisclosures[index].title = e.target.value;
                          setFormData({
                            ...formData,
                            disclosures: newDisclosures,
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={disclosure.description}
                        onChange={(e) => {
                          const newDisclosures = [...formData.disclosures];
                          newDisclosures[index].description = e.target.value;
                          setFormData({
                            ...formData,
                            disclosures: newDisclosures,
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addDisclosure}>
                  Add Another Disclosure
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          {step < 2 ? (
            <Button onClick={handleNextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              {isEditing ? "Update" : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

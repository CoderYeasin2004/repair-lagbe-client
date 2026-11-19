
"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Wrench,
  Image as ImageIcon,
  Upload,
  Eye,
  Info,
  AlertCircle,
  Home,
  Store,
  Plus,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createServices } from "@/lib/actions/services"

const CATEGORY_LABELS: Record<string, string> = {
  smartphone: "Smartphone",
  "laptop-pc": "Laptop & PC",
  ac: "AC",
  refrigerator: "Refrigerator",
  tv: "TV",
  "washing-machine": "Washing Machine",
  electrical: "Electrical",
}

type UploadImageResponse = {
  success: true
  imageUrl: string
}

type UploadImageError = {
  error: string
}

const AddServicePage = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [serviceMode, setServiceMode] = useState<"home" | "shop">("home")
  const [serviceArea, setServiceArea] = useState("")

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const result: UploadImageResponse | UploadImageError =
        await response.json()

      if (!response.ok || "error" in result) {
        throw new Error(
          "error" in result ? result.error : "Image upload failed."
        )
      }

      setUploadedImageUrl(result.imageUrl)
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while uploading the image."
      )
      setUploadedImageUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    setSelectedFile(file)
    setUploadError(null)
    setUploadedImageUrl(null)

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    await uploadImage(file)
  }

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  if (isUploading) return

  if (selectedFile && !uploadedImageUrl) {
    setUploadError("Please wait for the image upload to finish.")
    return
  }

  const serviceData = new FormData()

  serviceData.append("title", title)
  serviceData.append("category", category)
  serviceData.append("description", description)
  serviceData.append("price", price)
  serviceData.append("duration", duration)
  serviceData.append("serviceMode", serviceMode)
  serviceData.append("serviceArea", serviceArea)

  if (uploadedImageUrl) {
    serviceData.append("imageUrl", uploadedImageUrl)
  }

  try {
    const result = await createServices(serviceData)

    console.log("Service created successfully:", result)
  } catch (error) {
    console.error("Failed to create service:", error)
  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-[#F5F7FA] py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Link
              href="/dashboard/technician"
              className="transition-colors hover:text-[#167D9A]"
            >
              Dashboard
            </Link>
            <span className="mx-1">/</span>
            <span className="font-medium text-foreground">Add Service</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#102A43]">
                Add New Service
              </h1>
              <p className="mt-1 text-muted-foreground">
                Create a repair service and make it available for customer
                requests.
              </p>
            </div>

            <Badge className="border border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]">
              New Service
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-3">
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="size-4" />
                  Service Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-5">
                  {/* Service Title */}
                  <div className="space-y-2">
                    <Label>Service Title</Label>
                    <Input
                      placeholder="e.g. Laptop Screen Replacement"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="laptop-pc">Laptop & PC</SelectItem>
                        <SelectItem value="ac">AC</SelectItem>
                        <SelectItem value="refrigerator">Refrigerator</SelectItem>
                        <SelectItem value="tv">TV</SelectItem>
                        <SelectItem value="washing-machine">
                          Washing Machine
                        </SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe what your repair service includes, common issues you fix, and what customers can expect."
                      className="min-h-[140px]"
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                    />
                  </div>

                  {/* Base Price */}
                  <div className="space-y-2">
                    <Label>Base Price</Label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                        ৳
                      </span>
                      <Input
                        type="number"
                        placeholder="e.g. 1000"
                        className="pl-8"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Starting price for this service in BDT.
                    </p>
                  </div>

                  {/* Estimated Duration */}
                  <div className="space-y-2">
                    <Label>Estimated Duration</Label>
                    <Select
                      value={duration}
                      onValueChange={(value) => setDuration(value ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select estimated duration" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="30 minutes">30 minutes</SelectItem>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                        <SelectItem value="2-3 hours">2-3 hours</SelectItem>
                        <SelectItem value="3-5 hours">3-5 hours</SelectItem>
                        <SelectItem value="1 day">1 day</SelectItem>
                        <SelectItem value="2-3 days">2-3 days</SelectItem>
                        <SelectItem value="1 week">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Mode */}
                  <div className="space-y-2">
                    <Label>Service Mode</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setServiceMode("home")}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all",
                          serviceMode === "home"
                            ? "border-[#167D9A] bg-[#167D9A]/10 text-[#167D9A] hover:bg-[#167D9A]/20"
                            : "border-input bg-background text-foreground hover:bg-muted hover:text-[#167D9A]"
                        )}
                      >
                        <Home className="size-4" />
                        Home Visit
                      </button>

                      <button
                        type="button"
                        onClick={() => setServiceMode("shop")}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all",
                          serviceMode === "shop"
                            ? "border-[#167D9A] bg-[#167D9A]/10 text-[#167D9A] hover:bg-[#167D9A]/20"
                            : "border-input bg-background text-foreground hover:bg-muted hover:text-[#167D9A]"
                        )}
                      >
                        <Store className="size-4" />
                        Shop Drop-off
                      </button>
                    </div>
                  </div>

                  {/* Service Area */}
                  <div className="space-y-2">
                    <Label>Service Area</Label>
                    <Input
                      placeholder="Enter the areas you provide service in (e.g. Mirpur, Dhaka)"
                      value={serviceArea}
                      onChange={(event) =>
                        setServiceArea(event.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  Service Image
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-[#167D9A]/5 p-8 text-center transition-colors hover:border-[#167D9A]/50">
                  <input
                    id="service-image"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="sr-only"
                    onChange={handleImageChange}
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[#167D9A]" />
                      <p className="text-sm text-muted-foreground">
                        Uploading image...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="size-8 text-[#167D9A]" />

                      <p className="mt-3 text-sm font-semibold text-[#102A43]">
                        Upload Service Image
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG or WEBP
                      </p>

                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                          document.getElementById("service-image")?.click()
                        }
                      >
                        Choose Image
                      </Button>
                    </>
                  )}

                  {uploadError && (
                    <p className="mt-3 text-xs text-destructive">
                      {uploadError}
                    </p>
                  )}

                  {uploadedImageUrl && !isUploading && (
                    <p className="mt-3 text-xs text-green-600">
                      Image uploaded successfully.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" type="button">
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isUploading}
                className="bg-[#167D9A] text-white shadow-sm hover:bg-[#0f5f7a]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Create Service
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:col-span-1">
            {/* Service Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="size-4" />
                  Service Preview
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                    {uploadedImageUrl || imagePreview ? (
                      <img
                        src={uploadedImageUrl || imagePreview || ""}
                        alt="Service preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ImageIcon className="size-6 text-muted-foreground" />
                        <span className="mt-1 text-xs text-muted-foreground">
                          Service Image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#102A43]">
                        {title || "Untitled Service"}
                      </span>

                      <Badge variant="outline" className="text-xs">
                        {category
                          ? CATEGORY_LABELS[category]
                          : "Uncategorized"}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {serviceMode === "home"
                        ? "Home Visit"
                        : "Shop Drop-off"}
                      {serviceArea ? ` • ${serviceArea}` : ""}
                      {duration ? ` • ${duration}` : ""}
                    </p>

                    <div className="mt-2 flex items-baseline gap-1">
                      {price ? (
                        <>
                          <span className="text-lg font-bold text-[#102A43]">
                            ৳{price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / service
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          ৳0.00
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="size-4" />
                  Submission Information
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <AlertCircle className="size-5 flex-shrink-0 text-[#167D9A]" />

                    <div>
                      <p className="text-sm text-[#102A43]">
                        New services are submitted for admin approval.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your service will be reviewed before it appears to
                        customers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="border border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B]">
                      Pending Approval
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddServicePage

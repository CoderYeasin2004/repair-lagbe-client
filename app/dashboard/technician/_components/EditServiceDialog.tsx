
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateService } from "@/lib/actions/services";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
}

interface EditServiceDialogProps {
  service: Service;
}

type UploadImageResponse = {
  success: true;
  imageUrl: string;
};

type UploadImageError = {
  error: string;
};

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function EditServiceDialog({
  service,
}: EditServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(service.image);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(service.image);
  const [selectedFile, setSelectedFile] = useState(false);

  const router = useRouter();

  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result: UploadImageResponse | UploadImageError =
        await response.json();

      if (!response.ok || "error" in result) {
        throw new Error(
          "error" in result ? result.error : "Image upload failed."
        );
      }

      setUploadedImageUrl(result.imageUrl);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      setUploadedImageUrl("");
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(true);
    setUploadedImageUrl("");

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    await uploadImage(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || isUploading) return;

    if (selectedFile && !uploadedImageUrl) {
      toast.error("Please upload the selected image first.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set("id", service._id);
    formData.set("image", uploadedImageUrl || service.image);

    try {
      setLoading(true);

      const result = await updateService(formData);

      toast.success(result.message || "Service updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#102A43] transition hover:border-[#167D9A] hover:text-[#167D9A]"
      >
        <Edit className="size-3.5" />
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Edit Service
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your service information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading || isUploading}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Service Title
                </label>
                <input
                  name="title"
                  defaultValue={service.title}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#167D9A]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={service.category}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-[#167D9A]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={service.description}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#167D9A]"
                />
              </div>

              {/* ImgBB Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Service Image
                </label>

                <div className="space-y-3">
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Service preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="size-8" />
                        <span className="mt-2 text-sm">No image selected</span>
                      </div>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                        <Loader2 className="size-7 animate-spin" />
                        <span className="mt-2 text-sm">
                          Uploading image...
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    id={`edit-service-image-${service._id}`}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <label
                    htmlFor={`edit-service-image-${service._id}`}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#102A43] transition hover:border-[#167D9A] hover:text-[#167D9A]"
                  >
                    <Upload className="size-4" />
                    Choose New Image
                  </label>

                  <p className="text-xs text-slate-500">
                    PNG, JPG or WEBP. Leave unchanged to keep the current image.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Base Price
                  </label>
                  <input
                    name="basePrice"
                    type="number"
                    min="0.01"
                    step="any"
                    defaultValue={service.basePrice}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#167D9A]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Estimated Duration
                  </label>
                  <input
                    name="estimatedDuration"
                    defaultValue={service.estimatedDuration}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#167D9A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Service Mode
                  </label>
                  <select
                    name="serviceMode"
                    defaultValue={service.serviceMode}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-[#167D9A]"
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Service Area
                  </label>
                  <input
                    name="serviceArea"
                    defaultValue={service.serviceArea}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-[#167D9A]"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading || isUploading}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="rounded-lg bg-[#167D9A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12677F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Updating..."
                    : isUploading
                      ? "Uploading..."
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

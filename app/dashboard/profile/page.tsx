"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  Camera,
  Check,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { authClient, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  customer: {
    label: "Customer",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  technician: {
    label: "Technician",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  admin: {
    label: "Admin",
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
}

type UploadImageResult = {
  imageUrl?: string
  error?: string
}

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "U"
}

const ProfilePage = () => {
  const { data: session, isPending, refetch } = useSession()
  const user = session?.user

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [area, setArea] = useState("")
  const [bio, setBio] = useState("")

  const [savedImage, setSavedImage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null)

  const initializedUserId = useRef<string | null>(null)
  const previewObjectUrl = useRef<string | null>(null)
  const saveLock = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user || initializedUserId.current === user.id) return

    initializedUserId.current = user.id
    setName(user.name ?? "")
    setPhone(user.phone ?? "")
    setArea(user.area ?? "")
    setBio(user.bio ?? "")
    setSavedImage(user.image ?? "")
    setImagePreview(user.image ?? null)
  }, [user])

  useEffect(() => {
    return () => {
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current)
      }
    }
  }, [])

  const clearPreviewObjectUrl = () => {
    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current)
      previewObjectUrl.current = null
    }
  }

  const resetForm = () => {
    if (!user) return

    setName(user.name ?? "")
    setPhone(user.phone ?? "")
    setArea(user.area ?? "")
    setBio(user.bio ?? "")
    setImagePreview(savedImage || null)
    setPendingImageUrl(null)
    setUploadError(null)
    clearPreviewObjectUrl()

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleEdit = () => {
    resetForm()
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (isSaving || isUploading) return

    resetForm()
    setIsEditing(false)
  }

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

      const result = (await response.json()) as UploadImageResult

      if (!response.ok || !result.imageUrl) {
        throw new Error(result.error || "Image upload failed.")
      }

      setPendingImageUrl(result.imageUrl)
      setImagePreview(result.imageUrl)
      clearPreviewObjectUrl()
      toast.success("Image uploaded. Save changes to update your profile.")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while uploading the image."

      setUploadError(message)
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    if (!file.type.startsWith("image/")) {
      const message = "Please select a valid image file."
      setUploadError(message)
      toast.error(message)
      return
    }

    clearPreviewObjectUrl()

    const previewUrl = URL.createObjectURL(file)
    previewObjectUrl.current = previewUrl
    setImagePreview(previewUrl)
    setPendingImageUrl(null)
    setUploadError(null)

    await uploadImage(file)
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (saveLock.current || isSaving || isUploading) return

    if (!user) {
      toast.error("Please sign in to update your profile.")
      return
    }

    const trimmedName = name.trim()

    if (!trimmedName) {
      toast.error("Full name is required.")
      return
    }

    saveLock.current = true
    setIsSaving(true)

    const nextPhone = phone.trim()
    const nextArea = area.trim()
    const nextBio = bio.trim()

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
        phone: nextPhone,
        area: nextArea,
        bio: nextBio,
        ...(pendingImageUrl ? { image: pendingImageUrl } : {}),
      })

      if (error) {
        throw new Error(error.message || "Failed to update your profile.")
      }

      const nextImage = pendingImageUrl ?? savedImage

      setName(trimmedName)
      setPhone(nextPhone)
      setArea(nextArea)
      setBio(nextBio)
      setSavedImage(nextImage)
      setImagePreview(nextImage || null)
      setPendingImageUrl(null)
      setUploadError(null)
      setIsEditing(false)
      clearPreviewObjectUrl()

      void refetch()

      toast.success("Profile updated successfully.")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating your profile."

      toast.error(message)
    } finally {
      saveLock.current = false
      setIsSaving(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="size-5 animate-spin text-[#167D9A]" />
          Loading profile...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-10">
        <Card className="w-full max-w-md border-slate-200 text-center shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#167D9A]/10 text-[#167D9A]">
              <UserRound className="size-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-[#102A43]">
                Unable to load profile
              </h1>
              <p className="text-sm text-slate-500">
                Please sign in again to view and update your profile.
              </p>
            </div>
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#167D9A] px-5 text-sm font-medium text-white transition-colors hover:bg-[#126780]"
            >
              Go to Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const roleConfig = ROLE_CONFIG[user.role ?? "customer"] ?? ROLE_CONFIG.customer
  const displayName = name || user.name
  const profileImage = imagePreview ?? user.image ?? ""
  const completedFields = [
    name.trim(),
    savedImage || pendingImageUrl,
    phone.trim(),
    area.trim(),
    bio.trim(),
  ].filter(Boolean).length
  const completion = Math.round((completedFields / 5) * 100)

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#167D9A]">
              Account Settings
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#102A43] sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your personal information and profile photo.
            </p>
          </div>

          {!isEditing && (
            <Button
              type="button"
              onClick={handleEdit}
              className="h-10 gap-2 bg-[#167D9A] px-4 hover:bg-[#126780]"
            >
              <Pencil className="size-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <Card className="h-fit border-slate-200 shadow-sm">
            <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
              <div className="relative">
                <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#167D9A]/10 text-3xl font-semibold text-[#167D9A] shadow-md ring-1 ring-slate-200 sm:size-32">
                  {profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage}
                      alt={`${displayName} profile`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(displayName)}</span>
                  )}
                </div>

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      aria-label="Change profile picture"
                      className="absolute right-0 bottom-1 flex size-10 items-center justify-center rounded-full bg-[#167D9A] text-white shadow-lg ring-4 ring-white transition-colors hover:bg-[#126780] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isUploading ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Camera className="size-5" />
                      )}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {isUploading && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#167D9A]">
                  <Loader2 className="size-3.5 animate-spin" />
                  Uploading image...
                </p>
              )}

              {uploadError && !isUploading && (
                <p className="mt-3 text-xs font-medium text-red-600">
                  {uploadError}
                </p>
              )}

              <h2 className="mt-4 max-w-full text-xl font-bold break-words text-[#102A43]">
                {displayName}
              </h2>
              <p className="mt-1 max-w-full text-sm break-all text-slate-500">
                {user.email}
              </p>

              <Badge
                variant="outline"
                className={cn("mt-3 capitalize", roleConfig.className)}
              >
                <ShieldCheck className="size-3.5" />
                {roleConfig.label}
              </Badge>

              <div className="mt-6 w-full border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Profile completion</span>
                  <span className="text-[#167D9A]">{completion}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#167D9A] transition-all duration-300"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                {completion < 100 && (
                  <p className="mt-2 text-left text-xs text-slate-500">
                    Add a photo, phone number, area and bio to complete your
                    profile.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-200/80 pb-4">
              <CardTitle className="text-lg text-[#102A43]">
                Personal Information
              </CardTitle>
              <CardDescription>
                Keep your account details and public profile information up to
                date.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="profile-name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        readOnly={!isEditing}
                        required
                        maxLength={100}
                        placeholder="Enter your full name"
                        className={cn(
                          "h-10 pl-9",
                          !isEditing && "bg-slate-50 text-slate-600"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-email"
                        value={user.email}
                        readOnly
                        className="h-10 bg-slate-50 pl-9 text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-role">Role</Label>
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-role"
                        value={roleConfig.label}
                        readOnly
                        className="h-10 bg-slate-50 pl-9 text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        readOnly={!isEditing}
                        maxLength={30}
                        placeholder="Enter your phone number"
                        className={cn(
                          "h-10 pl-9",
                          !isEditing && "bg-slate-50 text-slate-600"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-area">Area</Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-area"
                        value={area}
                        onChange={(event) => setArea(event.target.value)}
                        readOnly={!isEditing}
                        maxLength={100}
                        placeholder="e.g. Mirpur, Dhaka"
                        className={cn(
                          "h-10 pl-9",
                          !isEditing && "bg-slate-50 text-slate-600"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="profile-bio">Bio</Label>
                    <div className="relative">
                      <FileText className="pointer-events-none absolute top-3 left-3 size-4 text-slate-400" />
                      <Textarea
                        id="profile-bio"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        readOnly={!isEditing}
                        maxLength={500}
                        placeholder="Tell customers a little about yourself."
                        className={cn(
                          "min-h-[120px] pl-9",
                          !isEditing && "bg-slate-50 text-slate-600"
                        )}
                      />
                    </div>
                    {isEditing && (
                      <p className="text-right text-xs text-slate-500">
                        {bio.length}/500 characters
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving || isUploading}
                      className="h-10 gap-2 px-4"
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving || isUploading}
                      className="h-10 gap-2 bg-[#167D9A] px-5 hover:bg-[#126780]"
                    >
                      {isSaving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

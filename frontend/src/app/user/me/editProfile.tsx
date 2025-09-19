"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  // DialogClose,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
// import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiFetcher } from "@/lib/apiFetcher";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { FetchedData } from "./page";
import { Input } from "@/components/ui/input";
import {
  CloudinaryUploadResult,
  handleProfileImageUpload,
} from "@/lib/cloudinaryUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  avatarURL: string;
  bio: string;
  about: string;
  instagramLink: string;
  twitterLink: string;
  externalLinks: string[];
  profilePicturePublicID: string;
}
interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarURL?: string;
  bio?: string;
  about?: string;
  instagramLink?: string;
  twitterLink?: string;
  externalLinks?: string;
  general?: string;
  profilePicturePublicID?: string;
}

interface EditProfileProps {
  userdata: FetchedData;
}

interface ExternalLinkProps {
  index: number;
  value: string;
  isLoading: boolean;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const ExternalLinks = ({
  index,
  value,
  isLoading,
  onChange,
  onRemove,
}: ExternalLinkProps) => {
  return (
    <div className="grid grid-flow-col grid-rows-2 grid-cols-2 p-2 gap-1  border dark:border-muted/25 rounded-lg  border-neutral-300">
      <label htmlFor={`external-link-${index}`} className="text-sm col-span-2">
        External link {index + 1}
      </label>
      <input
        id={`external-link-${index}`}
        type="text"
        placeholder="Add external link"
        disabled={isLoading}
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        className="outline-none focus:outline-none w-full focus:ring-0 placeholder:text-sm placeholder:opacity-60 col-span-2 "
      />
      <Button
        variant="secondary"
        size="icon"
        type="button"
        onClick={() => onRemove(index)}
        className={`size-8 row-span-2 items-center  h-full 
            `}
      >
        <X />
      </Button>
    </div>
  );
};

const EditProfile = ({ userdata }: EditProfileProps) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: userdata.firstName || "",
    lastName: userdata.lastName || "",
    username: userdata.username || "",
    avatarURL: userdata.avatarURL || "",
    bio: userdata.bio || "",
    about: userdata.about || "",
    instagramLink: userdata.instagramLink || "",
    twitterLink: userdata.twitterLink || "",
    externalLinks: userdata.externalLinks || [""],
    profilePicturePublicID: userdata.profilePicturePublicID || "",
  });
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };
  const handleInputExternalLinkChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.map((link, i) =>
        i === index ? value : link
      ),
    }));
  };

  const handleRemoveExternalLink = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleFileSelectAndUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const maxSizeInMB = 5;
    const file = event.target.files?.[0];
    if (!file) return;

    setErrors((prev) => ({ ...prev, ["externalLinks"]: undefined }));

    if (!acceptedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        ["externalLinks"]: `Please select a valid image file (${acceptedTypes.join(
          ", "
        )})`,
      }));
      return;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrors((prev) => ({
        ...prev,
        ["externalLinks"]: `File size must be less than ${maxSizeInMB}MB`,
      }));
      return;
    }
    const imageData: CloudinaryUploadResult = await handleProfileImageUpload(
      file
    );
    console.log(imageData);
    setIsProfileDialogOpen(false);
    handleInputChange("avatarURL", imageData.secure_url);
    handleInputChange("profilePicturePublicID", imageData.public_id);
  };

  const handleSubmit = async (e: FormEvent): Promise<boolean | null> => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    try {
      const path = "/api/users/me";
      const dataToSend = {
        ...formData,
        externalLinks: formData.externalLinks.filter(Boolean),
      };
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      };
      const response = await apiFetcher(path, options);
      if (response.status === 404) {
        return null; // This will immediately stop rendering and show the 404 page
      }

      if (response.ok) {
        router.refresh();
        setIsDialogOpen(false);
        return true;
      } else {
        const data = await response.json();
        setErrors({ general: data.error || "Failed to update." });
        return false;
      }
    } catch {
      setErrors({
        general: "Something went wrong.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAvatar = async (e: FormEvent): Promise<boolean | null> => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    try {
      const path = "/api/users/profile/avatar";
      // const dataToSend = {
      //   imagePublicID: formData.profilePicturePublicID,
      // };
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(dataToSend),
      };
      const response = await apiFetcher(path, options);
      if (response.status === 404) {
        return null; // This will immediately stop rendering and show the 404 page
      }

      if (response.ok) {
        // await new Promise((resolve) => setTimeout(resolve, 500));
        router.refresh();
        setIsProfileDialogOpen(false);
        // console.log(response);
        handleInputChange("avatarURL", "");
        handleInputChange("profilePicturePublicID", "");
        return true;
      } else {
        const data = await response.json();
        setErrors({ general: data.error || "Failed to update." });
        return false;
      }
    } catch {
      setErrors({
        general: "Something went wrong.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const destructureFullname = (e: string) => {
    const parts = e.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    handleInputChange("firstName", firstName.toLowerCase());
    handleInputChange("lastName", lastName.toLowerCase());
  };
  const getInitials = (user: FormData): string => {
    if (!user) {
      return "GU";
    }
    const firstNameInitial = user.firstName ? user.firstName[0] : "";
    const lastNameInitial = user.lastName ? user.lastName[0] : "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  // const triggerFileSelect = () => {
  //   fileInputRef.current?.click();
  // };

  return (
    <div>
      {isLoading ? (
        <div className=" w-full h-96 flex items-center justify-center">
          <Spinner className="mr-2 h-12 w-12" />
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild className=" ">
            <Button>Edit profile</Button>
          </DialogTrigger>
          <DialogContent className="fixed ease-in-out flex flex-col gap-2 left-1/2 top-1/2 sm:max-h-[95dvh] max-h-[90dvh] overflow-hidden h-[90dvh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow dark:bg-[#121212] bg-gray-50">
            <DialogHeader>
              <DialogTitle className="m-0 text-[17px] font-medium ">
                Edit profile
              </DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} id="edit-profile-form">
              <ScrollArea
                className={`h-[calc(90dvh-180px)] w-full flex flex-col gap-2 scroll-smooth py-1`}
              >
                <div className=" w-full flex flex-col gap-2 pr-3">
                  <div className=" flex flex-col p-2 gap-2 px-2.5 ml-1.5 items-center">
                    <Avatar className=" size-20">
                      <AvatarImage src={formData.avatarURL} />
                      <AvatarFallback className=" bg-amber-300 text-3xl font-semibold">
                        {getInitials(formData)}
                      </AvatarFallback>
                    </Avatar>

                    <Dialog
                      open={isProfileDialogOpen}
                      onOpenChange={setIsProfileDialogOpen}
                    >
                      <DialogTrigger>
                        <span className=" text-sm outline-0 font-semibold text-indigo-400">
                          Change photo
                        </span>
                      </DialogTrigger>
                      <DialogContent className=" p-0 flex flex-col gap-0 contain-content dark:bg-[#121212] bg-gray-50  w-[300px] max-w-[300px]">
                        <div className=" ">
                          {" "}
                          <Label
                            htmlFor="change-profile-image"
                            className=" w-full flex justify-center font-semibold h-9 text-blue-500"
                          >
                            Choose file
                          </Label>
                          <Input
                            id="change-profile-image"
                            type="file"
                            accept={acceptedTypes.join(",")}
                            onChange={handleFileSelectAndUpload}
                            className=" hidden"
                          />
                        </div>
                        <Separator />
                        <div className=" ">
                          {" "}
                          <Button
                            type="button"
                            onClick={handleDeleteAvatar}
                            className=" dark:bg-[#121212] text-red-400 h-9 bg-gray-50 w-full  font-semibold"
                          >
                            Remove photo
                          </Button>
                        </div>
                        <Separator />
                        <DialogClose className=" h-9 ">
                          {" "}
                          <span className=" text-sm dark:bg-[#121212] bg-gray-50 w-full text-black dark:text-white font-semibold">
                            Cancel
                          </span>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className=" flex flex-col p-2 gap-1 px-2.5 border dark:border-muted/25 border-neutral-300 rounded-lg">
                    <label htmlFor="username" className=" text-sm">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="Add username"
                      value={formData.username}
                      disabled={isLoading}
                      onChange={(e) =>
                        handleInputChange(
                          "username",
                          e.target.value.toLowerCase()
                        )
                      }
                      className=" outline-none focus:outline-none focus:ring-0 placeholder:text-sm placeholder:opacity-60"
                    />
                  </div>
                  <div className=" flex flex-col p-2 gap-1 px-2.5 border dark:border-muted/25 border-neutral-300 rounded-lg">
                    <label htmlFor="name" className=" text-sm">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Add name"
                      value={[formData.firstName, formData.lastName]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={isLoading}
                      onChange={(e) => destructureFullname(e.target.value)}
                      className=" outline-none focus:outline-none focus:ring-0 placeholder:text-sm placeholder:opacity-60"
                    />
                  </div>
                  <div className=" flex flex-col p-2 gap-1 px-2.5 border dark:border-muted/25 border-neutral-300 rounded-lg">
                    <label htmlFor="bio" className=" text-sm">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="Add bio"
                      disabled={isLoading}
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="h-32 resize-none border-0 p-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-sm placeholder:opacity-60"
                    />
                    <p>{}</p>
                  </div>
                  <div className=" flex flex-col p-2 gap-1 px-2.5 border dark:border-muted/25 border-neutral-300 rounded-lg">
                    <label htmlFor="about" className=" text-sm">
                      About
                    </label>
                    <Textarea
                      id="about"
                      placeholder="Add about"
                      disabled={isLoading}
                      value={formData.about}
                      onChange={(e) =>
                        handleInputChange("about", e.target.value)
                      }
                      className="h-32 resize-none border-0 p-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-sm placeholder:opacity-60"
                    />
                    <p>{}</p>
                  </div>
                  <div className=" flex flex-col p-2 gap-1 px-2.5 border dark:border-muted/25 border-neutral-300 rounded-lg">
                    <label htmlFor="instagram" className=" text-sm">
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      type="text"
                      placeholder="Add instagram link"
                      value={formData.instagramLink}
                      disabled={isLoading}
                      onChange={(e) =>
                        handleInputChange("instagramLink", e.target.value)
                      }
                      className=" outline-none focus:outline-none focus:ring-0 placeholder:text-sm placeholder:opacity-60"
                    />
                  </div>
                  <div className=" flex flex-col p-2 gap-1 px-2.5 border dark:border-muted/25 border-neutral-300 rounded-lg">
                    <label htmlFor="twitter" className=" text-sm">
                      Twitter
                    </label>
                    <input
                      id="twitter"
                      type="text"
                      placeholder="Add twitter link"
                      value={formData.twitterLink}
                      disabled={isLoading}
                      onChange={(e) =>
                        handleInputChange("twitterLink", e.target.value)
                      }
                      className=" outline-none focus:outline-none focus:ring-0 placeholder:text-sm placeholder:opacity-60"
                    />
                  </div>
                  {formData.externalLinks.map((linkValue, index) => (
                    <ExternalLinks
                      key={index}
                      index={index}
                      value={linkValue}
                      isLoading={isLoading}
                      onChange={handleInputExternalLinkChange}
                      onRemove={handleRemoveExternalLink}
                    />
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      // This now just adds a new empty string to the array
                      setFormData((prev) => ({
                        ...prev,
                        externalLinks: [...prev.externalLinks, ""],
                      }))
                    }
                    disabled={isLoading || formData.externalLinks.length >= 3}
                    variant="secondary"
                  >
                    {formData.externalLinks.length >= 3
                      ? "Maximum Links (3)"
                      : "Add another link"}
                  </Button>
                </div>
              </ScrollArea>
            </form>
            <DialogFooter>
              <div className="flex gap-2 ">
                <div className=" flex justify-end w-full">
                  <DialogClose asChild>
                    <Button type="button" aria-label="Close" className="w-full">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
                <div className="flex justify-end w-full">
                  <Button
                    className="w-full"
                    type="submit"
                    form="edit-profile-form"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EditProfile;

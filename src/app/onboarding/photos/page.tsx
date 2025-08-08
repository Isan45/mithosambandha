
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase/client';
import { Loader2, UploadCloud, Image as ImageIcon, X, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const FileUploadArea = ({
  onFileChange,
  title,
  description,
  icon: Icon,
  preview,
  onRemove,
  isMultiple = false,
  accept = "image/png, image/jpeg, image/jpg",
}: {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  icon: React.ElementType;
  preview: string | string[] | null;
  onRemove?: (index?: number) => void;
  isMultiple?: boolean;
  accept?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previews = Array.isArray(preview) ? preview : (preview ? [preview] : []);

  return (
    <div>
      <div
        className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted"
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon className="h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={isMultiple}
          accept={accept}
          className="hidden"
          onChange={onFileChange}
        />
      </div>
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previews.map((src, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={src}
                alt={`Preview ${index + 1}`}
                fill
                className="rounded-md object-cover"
              />
              {onRemove && (
                 <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => onRemove(isMultiple ? index : undefined)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default function PhotosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [idDocument, setIdDocument] = useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (setter: Function, previewSetter: Function, isMultiple = false) => (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (isMultiple) {
        const filesArray = Array.from(e.target.files);
        setter((prev: File[]) => {
            const newFiles = [...prev, ...filesArray];
            if (newFiles.length > 5) {
                toast({ variant: 'destructive', title: 'Limit Exceeded', description: 'You can upload a maximum of 5 gallery photos.'});
                return prev;
            }
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            previewSetter((p: string[]) => [...p, ...newPreviews].slice(0, 5));
            return newFiles.slice(0,5);
        });
      } else {
        const file = e.target.files[0];
        setter(file);
        previewSetter(URL.createObjectURL(file));
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPhotos(files => files.filter((_, i) => i !== index));
    setGalleryPreviews(previews => previews.filter((_, i) => i !== index));
  };
  
  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePreview(null);
  };
  
  const removeIdDocument = () => {
    setIdDocument(null);
    setIdPreview(null);
  };

  const uploadFile = async (storagePath: string, file: File): Promise<string> => {
    if (!user) throw new Error("User not authenticated for file upload.");
    const storage = getStorage();
    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };
  

  const handleSubmit = async () => {
    if (!profilePhoto) {
      toast({ variant: 'destructive', title: 'Profile Photo Required', description: 'Please upload a profile photo to continue.' });
      return;
    }
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated' });
      return;
    }

    setIsUploading(true);
    let profilePhotoURL, idDocumentURL;
    let galleryPhotoURLs = [];

    try {
      // Step 1: Upload Profile Photo
      try {
        profilePhotoURL = await uploadFile(`user-photos/${user.uid}/profile-photo`, profilePhoto);
      } catch (error) {
        console.error("Profile photo upload failed:", error);
        throw new Error("Failed to upload profile photo. Please check your connection and security rules.");
      }

      // Step 2: Upload Gallery Photos
      try {
        galleryPhotoURLs = await Promise.all(
          galleryPhotos.map((file, index) => 
            uploadFile(`user-photos/${user.uid}/gallery/${file.name}-${index}`, file)
          )
        );
      } catch (error) {
        console.error("Gallery photos upload failed:", error);
        throw new Error("Failed to upload one or more gallery photos.");
      }
      
      // Step 3: Upload ID Document
      if (idDocument) {
        try {
          idDocumentURL = await uploadFile(`user-documents/${user.uid}/id-document`, idDocument);
        } catch(error) {
          console.error("ID Document upload failed:", error);
          throw new Error("Failed to upload ID document.");
        }
      }

      // Step 4: Update Firestore
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          profile: { 
              profilePhoto: profilePhotoURL,
              galleryPhotos: galleryPhotoURLs,
              idDocument: idDocumentURL || null,
          },
          profileStatus: 'pending-review',
        }, { merge: true });
      } catch (error) {
        console.error("Firestore update failed:", error);
        throw new Error("Failed to save profile data to the database.");
      }

      toast({
        title: 'Profile Submitted!',
        description: 'Your profile is complete and has been submitted for review.',
      });

      router.push('/dashboard');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Step 5: Upload Your Photos
              </CardTitle>
              <CardDescription>
                Your photos are the most important part of your profile.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="text-primary"/> Profile Photo</CardTitle>
              <CardDescription>
                This is the first impression. Please upload your fully visible single photo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                onFileChange={handleFileChange(setProfilePhoto, setProfilePreview)}
                title="Click or drag to upload"
                description="Your main profile picture"
                icon={UploadCloud}
                preview={profilePreview}
                onRemove={removeProfilePhoto}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photo Gallery</CardTitle>
              <CardDescription>
                Upload up to 5 photos. The more photos you have, the more chances of a match.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                onFileChange={handleFileChange(setGalleryPhotos, setGalleryPreviews, true)}
                title="Click or drag to upload"
                description="Showcase your personality"
                icon={UploadCloud}
                preview={galleryPreviews}
                onRemove={removeGalleryImage}
                isMultiple={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-accent"/> ID Verification (Optional)</CardTitle>
              <CardDescription>
                We take verification seriously to reduce fake profiles. Your ID will be deleted after your verification is complete.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                onFileChange={handleFileChange(setIdDocument, setIdPreview)}
                title="Upload ID Document"
                description="e.g., Driver's License or Passport"
                icon={UploadCloud}
                preview={idPreview}
                onRemove={removeIdDocument}
              />
            </CardContent>
          </Card>
          
          <Button
            onClick={handleSubmit}
            disabled={isUploading || !profilePhoto}
            className="w-full"
            size="lg"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUploading ? 'Submitting...' : 'Complete Profile & Submit for Review'}
          </Button>

        </div>
      </div>
    </div>
  );
}

    
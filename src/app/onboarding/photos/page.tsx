
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
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
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [idDocument, setIdDocument] = useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const [existingProfilePhotoUrl, setExistingProfilePhotoUrl] = useState<string|null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [existingIdUrl, setExistingIdUrl] = useState<string|null>(null);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchExistingPhotos() {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().profile) {
            const profile = docSnap.data().profile;
            if (profile.profilePhoto) {
                setProfilePreview(profile.profilePhoto);
                setExistingProfilePhotoUrl(profile.profilePhoto);
            }
            if (profile.galleryPhotos) {
                setGalleryPreviews(profile.galleryPhotos);
                setExistingGalleryUrls(profile.galleryPhotos);
            }
            if (profile.idDocument) {
                setIdPreview(profile.idDocument);
                setExistingIdUrl(profile.idDocument);
            }
        }
    }
    fetchExistingPhotos();
  }, [user]);

  const handleFileChange = (setter: Function, previewSetter: Function, isMultiple = false) => (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (isMultiple) {
        const filesArray = Array.from(e.target.files);
        if (filesArray.length > 5) {
            toast({ variant: 'destructive', title: 'Limit Exceeded', description: 'You can upload a maximum of 5 gallery photos.'});
            return;
        }
        setter(filesArray);
        galleryPreviews.forEach(p => {
          if (p.startsWith('blob:')) URL.revokeObjectURL(p)
        });
        const newPreviews = filesArray.map(file => URL.createObjectURL(file));
        previewSetter(newPreviews);
      } else {
        const file = e.target.files[0];
        setter(file);
        if (previewSetter === setProfilePreview && profilePreview?.startsWith('blob:')) URL.revokeObjectURL(profilePreview);
        if (previewSetter === setIdPreview && idPreview?.startsWith('blob:')) URL.revokeObjectURL(idPreview);
        previewSetter(URL.createObjectURL(file));
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    const newPhotos = [...galleryPhotos];
    const newPreviews = [...galleryPreviews];
    
    // Check if the removed image was from the existing URLs or newly added files
    const isExisting = existingGalleryUrls.includes(newPreviews[index]);

    if (isExisting) {
      const urlToRemove = newPreviews[index];
      setExistingGalleryUrls(prev => prev.filter(u => u !== urlToRemove));
    } else {
      newPhotos.splice(index, 1);
    }

    if (newPreviews[index].startsWith('blob:')) URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    
    setGalleryPhotos(newPhotos);
    setGalleryPreviews(newPreviews);
  };
  
  const removeProfilePhoto = () => {
    if (profilePreview?.startsWith('blob:')) URL.revokeObjectURL(profilePreview);
    setProfilePhoto(null);
    setProfilePreview(null);
    setExistingProfilePhotoUrl(null);
  };
  
  const removeIdDocument = () => {
    if (idPreview?.startsWith('blob:')) URL.revokeObjectURL(idPreview);
    setIdDocument(null);
    setIdPreview(null);
    setExistingIdUrl(null);
  };

  const uploadFile = async (storagePath: string, file: File): Promise<string> => {
    if (!user) throw new Error("User not authenticated for file upload.");
    const storage = getStorage();
    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };
  

  const handleSubmit = async () => {
    if (!profilePhoto && !existingProfilePhotoUrl) {
      toast({ variant: 'destructive', title: 'Profile Photo Required', description: 'Please upload a profile photo to continue. This is the main photo that represents you.' });
      return;
    }
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated' });
      return;
    }

    setIsUploading(true);
    
    try {
      let profilePhotoURL = existingProfilePhotoUrl;
      let galleryPhotoURLs = existingGalleryUrls;
      let idDocumentURL = existingIdUrl;

      if (profilePhoto) {
        profilePhotoURL = await uploadFile(`user-photos/${user.uid}/profile-photo`, profilePhoto);
      }

      if(galleryPhotos.length > 0) {
        const newGalleryURLs = await Promise.all(
          galleryPhotos.map((file, index) => 
            uploadFile(`user-photos/${user.uid}/gallery/${file.name}-${index}`, file)
          )
        );
        // Combine old and new gallery URLs
        galleryPhotoURLs = [...existingGalleryUrls, ...newGalleryURLs];
      }
      
      if (idDocument) {
        idDocumentURL = await uploadFile(`user-documents/${user.uid}/id-document`, idDocument);
      }

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        profile: { 
            profilePhoto: profilePhotoURL,
            galleryPhotos: galleryPhotoURLs,
            idDocument: idDocumentURL || null,
        },
        profileStatus: 'pending-review',
      }, { merge: true });

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
              <CardTitle className="flex items-center gap-2"><ImageIcon className="text-primary"/> Profile Photo (Required)</CardTitle>
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
            disabled={isUploading || authLoading}
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

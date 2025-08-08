
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase/client';
import { Loader2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

export default function PhotosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      if (files.length + selectedFiles.length > 5) {
          toast({ variant: 'destructive', title: 'Too many files', description: 'You can upload a maximum of 5 photos.' });
          return;
      }

      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFiles(files => files.filter((_, i) => i !== index));
    setPreviews(previews => previews.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {
    if (files.length < 3) {
      toast({
        variant: 'destructive',
        title: 'Not enough photos',
        description: 'Please upload at least 3 photos to continue.',
      });
      return;
    }
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated' });
      return;
    }

    setIsUploading(true);

    try {
      const storage = getStorage();
      const photoURLs = await Promise.all(
        files.map(async file => {
          const storageRef = ref(storage, `user-photos/${user.uid}/${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return await getDownloadURL(snapshot.ref);
        })
      );
      
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        'profile.photos': photoURLs,
        profileStatus: 'pending-review',
      }, { merge: true });

      toast({
        title: 'Profile Submitted!',
        description: 'Your profile is complete and has been submitted for review.',
      });

      router.push('/dashboard');

    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an error submitting your photos. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Step 5: Upload Your Photos
              </CardTitle>
              <CardDescription>
                A picture is worth a thousand words. Upload at least 3 recent, high-quality photos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click or drag to upload (at least 3 photos)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {previews.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 font-medium">Selected Photos:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={src}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="rounded-md object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={isUploading || files.length < 3}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isUploading ? 'Submitting...' : 'Complete Profile & Submit for Review'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

    
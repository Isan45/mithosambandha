
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/i18n/routing';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  Loader2,
  Upload,
  User,
  Image as ImageIcon,
  FileCheck2,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';

export default function PhotosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [idDocument, setIdDocument] = useState<string | null>(null);

  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingId, setIsUploadingId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const profile = docSnap.data().profile || {};
          setProfilePhoto(profile.profilePhoto || null);
          setGalleryPhotos(profile.galleryPhotos || []);
          setIdDocument(profile.idDocument || null);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        toast({ variant: 'destructive', title: 'Failed to load photo data' });
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchProfileData();
  }, [user, toast]);

  const handleFileUpload = async (
    file: File,
    path: string,
    setUploading: (isUploading: boolean) => void
  ) => {
    if (!user) return null;
    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/${path}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Could not upload the file. Please try again.',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onProfilePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleFileUpload(
        file,
        'profile-photo',
        setIsUploadingProfile
      );
      if (url) setProfilePhoto(url);
    }
  };

  const onGalleryPhotosChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      setIsUploadingGallery(true);
      const urls = await Promise.all(
        Array.from(files).map(file =>
          handleFileUpload(file, 'gallery-photos', () => {})
        )
      );
      const validUrls = urls.filter(Boolean) as string[];
      setGalleryPhotos(prev => [...prev, ...validUrls]);
      setIsUploadingGallery(false);
    }
  };

  const onIdDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleFileUpload(file, 'id-documents', setIsUploadingId);
      if (url) setIdDocument(url);
    }
  };

  const handleDeleteGalleryPhoto = async (urlToDelete: string) => {
    try {
      // Create a reference to the file to delete
      const photoRef = ref(storage, urlToDelete);
      // Delete the file
      await deleteObject(photoRef);
      setGalleryPhotos(prev => prev.filter(url => url !== urlToDelete));
      toast({ title: 'Photo deleted successfully.' });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description:
          'Could not delete the photo. It might be already deleted.',
      });
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!profilePhoto) {
      toast({
        variant: 'destructive',
        title: 'Missing Profile Photo',
        description: 'Please upload a profile photo to continue.',
      });
      return;
    }
    if (!idDocument) {
      toast({
        variant: 'destructive',
        title: 'Missing ID Document',
        description: 'Please upload an ID document for verification.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      const fieldValues = {
        profilePhoto,
        galleryPhotos,
        idDocument
      };
      
      let profileCompletion = existingData.profile.profileCompletion || 0;
      if (profilePhoto) profileCompletion = Math.max(profileCompletion, 0.8);
      if (galleryPhotos.length > 0) profileCompletion = Math.max(profileCompletion, 0.9);
      if (idDocument) profileCompletion = 1.0;


      await setDoc(
        userDocRef,
        {
          profile: {
            ...existingData.profile,
            ...fieldValues,
            profileCompletion,
          },
          profileStatus: 'pending-review',
        },
        { merge: true }
      );

      toast({
        title: 'Profile Submitted for Review!',
        description:
          "Thank you! Our team will review your profile shortly. You'll be notified upon approval.",
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'Failed to submit your profile for review.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const FileInput = ({
    id,
    onChange,
    isUploading,
    Icon,
    label,
    description,
    multiple = false,
  }: any) => (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor={id}
        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary hover:bg-muted"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Icon className="mb-4 h-8 w-8 text-muted-foreground" />
          )}
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">{label}</span>
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <input
          id={id}
          type="file"
          className="hidden"
          onChange={onChange}
          accept="image/*,.pdf"
          multiple={multiple}
          disabled={isUploading}
        />
      </label>
    </div>
  );

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Step 4: Photos & Verification
              </CardTitle>
              <CardDescription>
                A great profile has great photos. Upload a clear profile
                picture and a few gallery photos. Your ID is kept confidential
                and is only for verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-8">
                {/* Profile Photo */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Profile Photo</h3>
                  {profilePhoto ? (
                    <div className="relative h-48 w-48 rounded-lg">
                      <Image
                        src={profilePhoto}
                        alt="Profile"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <FileInput
                      id="profile-photo-upload"
                      onChange={onProfilePhotoChange}
                      isUploading={isUploadingProfile}
                      Icon={User}
                      label="Upload Profile Photo"
                      description="A clear headshot is best"
                    />
                  )}
                </div>

                {/* Gallery Photos */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Gallery Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryPhotos.map((url, index) => (
                      <div key={index} className="relative h-32 w-full group">
                        <Image
                          src={url}
                          alt={`Gallery photo ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                         <button
                            type="button"
                            onClick={() => handleDeleteGalleryPhoto(url)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                           <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                    ))}
                    {galleryPhotos.length < 8 && (
                       <FileInput
                          id="gallery-photos-upload"
                          onChange={onGalleryPhotosChange}
                          isUploading={isUploadingGallery}
                          Icon={ImageIcon}
                          label="Add More Photos"
                          description={`${8-galleryPhotos.length} remaining`}
                          multiple={true}
                        />
                    )}
                  </div>
                </div>

                {/* ID Document */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">
                    ID for Verification
                  </h3>
                   <p className="text-sm text-muted-foreground">
                    This is kept confidential and only used to verify your identity. It will not be shown on your profile.
                  </p>
                  {idDocument ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold p-4 border border-green-200 bg-green-50 rounded-lg">
                       <FileCheck2 className="h-8 w-8" />
                       <p>ID Document Uploaded. You can replace it by uploading a new one.</p>
                    </div>
                  ) : (
                    <FileInput
                      id="id-document-upload"
                      onChange={onIdDocumentChange}
                      isUploading={isUploadingId}
                      Icon={Upload}
                      label="Upload ID Document"
                      description="Passport, Driver's License, etc."
                    />
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || isLoadingData}
                >
                  {isSubmitting
                    ? 'Submitting for Review...'
                    : 'Complete Profile & Submit for Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

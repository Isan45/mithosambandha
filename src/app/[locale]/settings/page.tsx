
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your notification preferences have been updated.",
        });
    };

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-headline text-4xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account details and notification preferences.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Control how you receive notifications from us.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="new-match-email" className="font-semibold">New Matches</Label>
                <p className="text-sm text-muted-foreground">
                  Receive an email when you get a new match.
                </p>
              </div>
              <Switch id="new-match-email" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="new-message-email" className="font-semibold">New Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified by email when someone messages you.
                </p>
              </div>
              <Switch id="new-message-email" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="profile-view-email" className="font-semibold">Profile Views</Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of who viewed your profile.
                </p>
              </div>
              <Switch id="profile-view-email" />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                    Change your password or manage your account status.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                 <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                 <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
                <Button>Change Password</Button>
                <Separator className="my-6" />
                <div className="space-y-2">
                    <h4 className="font-semibold text-destructive">Deactivate Account</h4>
                    <p className="text-sm text-muted-foreground">
                        Deactivating your account will hide your profile. You can reactivate it by logging in again.
                    </p>
                    <Button variant="outline">Deactivate</Button>
                </div>
                 <div className="space-y-2 pt-4">
                    <h4 className="font-semibold text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

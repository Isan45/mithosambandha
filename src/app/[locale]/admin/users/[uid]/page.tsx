
import { getUser } from '@/lib/server-actions/users';
import { getAuditLogs } from '@/lib/server-actions/monitoring';
import type { UserProfile } from '@/types';
import { UserActions } from '@/components/admin/user-actions';
import { MembershipBadge } from '@/components/premium/membership-badge';
import { MembershipSelector } from '@/components/admin/membership-selector';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Cake,
  MapPin,
  Heart,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Mail,
  Phone,
  User as UserIcon,
  Edit,
  Ban,
  CheckCircle2,
  History,
  HeartHandshake,
  Globe,
  Users
} from 'lucide-react';

function calculateAge(dob?: string) {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const InfoPill = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary-foreground">
    <span className="font-semibold text-primary">{label}:</span>
    <span className="text-primary/80">{value || 'N/A'}</span>
  </div>
);

const DetailItem = ({ icon: Icon, label, value, children }: { icon: React.ElementType, label: string, value?: any, children?: React.ReactNode }) => (
    <div className="flex items-start gap-4 py-3">
        <Icon className="h-5 w-5 mt-1 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="font-semibold text-md">{children || value || 'N/A'}</div>
        </div>
    </div>
);


export default async function UserInspectorPage({ 
  params 
}: { 
  params: Promise<{ uid: string }> 
}) {
  const { uid } = await params;
  const user = await getUser(uid);
  const logs = await getAuditLogs(10, uid);

  if (!user) {
    notFound();
  }

  const p = (user as any).profile || {};
  const age = calculateAge(p.dob);
  const profilePhotoUrl = p.profilePhoto || 'https://placehold.co/400x400.png';

  return (
    <div className="p-4 md:p-8 space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="font-headline text-3xl font-bold">User Inspector</h1>
            <p className="text-muted-foreground">Detailed view of {user.fullName}'s profile and activity.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
            <Button asChild variant="outline" size="sm">
                <Link href={`/admin/users/${user.uid}/edit`}><Edit className="mr-2 h-4 w-4"/>Edit Profile</Link>
            </Button>
            <UserActions uid={user.uid} currentStatus={user.profileStatus || 'incomplete'} />
        </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                     <Image
                        src={profilePhotoUrl}
                        alt={user.fullName}
                        width={128}
                        height={128}
                        className="rounded-full object-cover w-32 h-32 border-4 border-primary"
                        data-ai-hint="person portrait"
                      />
                      <h2 className="font-headline text-2xl mt-4">{user.fullName}</h2>
                      <p className="text-sm text-muted-foreground">UID: {user.uid}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MembershipBadge tier={user.membership || 'Free'} />
                        <Badge variant={user.profileStatus === 'approved' ? 'default' : 'secondary'}>{user.profileStatus}</Badge>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                </div>
                <Separator className="my-6"/>
                 <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined:</span>
                        <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Active:</span>
                        <span>{user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profile %:</span>
                        <span>{p.profileCompletion ? `${(p.profileCompletion * 100).toFixed(0)}%` : 'N/A'}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
          <Card>
              <CardHeader><CardTitle>Contact & Verification</CardTitle></CardHeader>
              <CardContent>
                <DetailItem icon={Mail} label="Email" value={user.email}>
                   <div className="flex items-center gap-2 font-semibold">
                        {user.email} 
                        {(user as any).emailVerified && <CheckCircle2 className="h-4 w-4 text-green-500"/>}
                    </div>
                </DetailItem>
                <DetailItem icon={Phone} label="Phone" value={p.phoneNumber} />
                <DetailItem icon={ShieldCheck} label="ID Verified">
                    <Badge variant={(p.idVerified) ? 'default' : 'secondary'}>
                        {p.idVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                </DetailItem>
                {p.idDocument && (
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2 font-semibold">Verification ID Document:</p>
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted">
                            <Image 
                                src={p.idDocument} 
                                alt="ID Document" 
                                fill 
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}
                <DetailItem icon={ShieldCheck} label="Membership Management">
                    <MembershipSelector uid={user.uid} currentTier={user.membership || 'Free'} />
                </DetailItem>
              </CardContent>
          </Card>
        </div>

        {/* Right Column: Details Tabs */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <DetailItem icon={UserIcon} label="Gender" value={p.gender} />
                    <DetailItem icon={Cake} label="Age" value={`${age} years old`} />
                    <DetailItem icon={MapPin} label="Current Location" value={p.currentLocation} />
                    <DetailItem icon={MapPin} label="Permanent Address" value={p.permanentAddress} />
                    <DetailItem icon={UserIcon} label="Marital Status" value={p.maritalStatus} />
                    <DetailItem icon={UserIcon} label="Height" value={p.height ? `${p.height.feet}' ${p.height.inches}"` : 'N/A'} />
                    <DetailItem icon={UserIcon} label="Religion" value={p.religion} />
                    <DetailItem icon={UserIcon} label="Caste" value={p.caste} />
                    <DetailItem icon={Globe} label="Nationality" value={p.nationality} />
                    <DetailItem icon={Globe} label="Visa Status" value={p.visaStatus} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Education & Career</CardTitle></CardHeader>
                <CardContent>
                    <DetailItem icon={GraduationCap} label="Education Level" value={p.education?.highestEducation} />
                    <DetailItem icon={GraduationCap} label="Field of Study" value={p.education?.fieldOfStudy} />
                    <DetailItem icon={GraduationCap} label="College/University" value={p.education?.college} />
                    <Separator className="my-4"/>
                    <DetailItem icon={Briefcase} label="Profession" value={p.career?.profession} />
                    <DetailItem icon={Briefcase} label="Company" value={p.career?.company} />
                    <DetailItem icon={Briefcase} label="Annual Income" value={p.career?.income} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Bio & Preferences</CardTitle></CardHeader>
                <CardContent>
                    <div>
                        <h4 className="font-semibold mb-2">Bio</h4>
                        <p className="text-muted-foreground">{p.bio || 'No bio provided.'}</p>
                    </div>
                     <Separator className="my-4"/>
                    <div>
                        <h4 className="font-semibold mb-2">Family Details</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <DetailItem icon={Users} label="Family Type" value={p.familyType} />
                            <DetailItem icon={Users} label="Family Values" value={p.familyValues} />
                        </div>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold block mb-1">Background:</span>{p.familyBackground || 'No family background provided.'}</p>
                    </div>
                     <Separator className="my-4"/>
                    <div>
                        <h4 className="font-semibold mb-2">Partner Preferences</h4>
                        <p className="text-muted-foreground">{p.partnerPreferences?.additionalPreferences || 'No preferences specified.'}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><History /> Recent Activity (Admin Actions)</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} className="flex flex-col space-y-1 pb-3 border-b last:border-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="text-[10px] uppercase">{log.action}</Badge>
                                    <span className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm">{log.reason || 'No reason provided'}</p>
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No recent administrative actions recorded for this user.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><HeartHandshake /> Match History</CardTitle></CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">A history of matches made for this user will appear here.</p>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Edit } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';

interface ProfileSectionProps {
  title: string;
  icon: React.ElementType;
  editPath: string;
  children: React.ReactNode;
}

export function ProfileSection({
  title,
  icon: Icon,
  editPath,
  children,
}: ProfileSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Icon className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-xl">{title}</CardTitle>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </CollapsibleTrigger>
          <Button asChild variant="outline" size="sm">
              <Link href={editPath}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
          </Button>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0 space-y-2">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

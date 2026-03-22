
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Star } from 'lucide-react';

interface AstrologyFormProps {
  initialData?: any;
  onSave: (data: any) => void;
}

export function AstrologyForm({ initialData, onSave }: AstrologyFormProps) {
  const [isDeep, setIsDeep] = useState(initialData?.type === 'deep');
  const [data, setData] = useState(initialData || { type: 'basic', rashi: '', nakshatra: '', manglik: 'unknown' });

  const handleToggle = (val: boolean) => {
    setIsDeep(val);
    setData((prev: any) => ({ ...prev, type: val ? 'deep' : 'basic' }));
  };

  return (
    <Card className="border-amber-100 bg-amber-50/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Adaptive Astrology
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="deep-mode" className="text-xs text-muted-foreground uppercase tracking-wider">Exact Birth Details</Label>
            <Switch 
              id="deep-mode" 
              checked={isDeep} 
              onCheckedChange={handleToggle} 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isDeep ? (
          <div className="text-sm text-amber-800 bg-amber-100/50 p-3 rounded-md border border-amber-200">
            <strong>Basic Mode:</strong> We'll use your Sun Sign and general alignment based on your birth month. This is perfect if you don't know your exact birth time.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rashi (Moon Sign)</Label>
              <Select value={data.rashi} onValueChange={(v) => setData((p: any) => ({...p, rashi: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Rashi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mesh">Mesh (Aries)</SelectItem>
                  <SelectItem value="vrish">Vrish (Taurus)</SelectItem>
                  <SelectItem value="mithun">Mithun (Gemini)</SelectItem>
                  {/* ... more rashis */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Manglik Status</Label>
              <Select value={data.manglik} onValueChange={(v) => setData((p: any) => ({...p, manglik: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Non-Manglik</SelectItem>
                  <SelectItem value="yes">Manglik</SelectItem>
                  <SelectItem value="partial">Anshik Manglik</SelectItem>
                  <SelectItem value="unknown">I don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full border-amber-200 hover:bg-amber-100"
          onClick={() => onSave(data)}
        >
          Save Astrological Details
        </Button>
      </CardContent>
    </Card>
  );
}

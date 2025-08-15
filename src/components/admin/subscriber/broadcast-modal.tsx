'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Send, Users } from 'lucide-react';
import { toast } from 'sonner';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriberCount: number;
}

export function BroadcastModal({ isOpen, onClose, subscriberCount }: BroadcastModalProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !content || !type) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/subscriber/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          type,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Broadcast email queued successfully!');
        setSubject('');
        setContent('');
        setType('');
        onClose();
      } else {
        throw new Error('Failed to send broadcast');
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Failed to send broadcast email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSubject('');
      setContent('');
      setType('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Broadcast Email</DialogTitle>
          <DialogDescription>
            Send a newsletter to all active subscribers. This will be sent to{' '}
            <span className="font-medium">{subscriberCount}</span> subscribers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Broadcast Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select broadcast type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">New Blog Post</SelectItem>
                <SelectItem value="project">New Project</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your email content here..."
              className="min-h-[200px]"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              You can use basic HTML tags for formatting.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              This email will be sent to <strong>{subscriberCount}</strong> active subscribers
            </span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !subject || !content || !type}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Send Broadcast
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
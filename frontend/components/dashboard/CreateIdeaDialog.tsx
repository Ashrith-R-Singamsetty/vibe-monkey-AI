import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus } from 'lucide-react';

interface CreateIdeaDialogProps {
  onIdeaCreated: () => void;
}

export function CreateIdeaDialog({ onIdeaCreated }: CreateIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [originalIdea, setOriginalIdea] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (newIdea: { name: string; originalIdea: string; context: any }) =>
      backend.idea.create(newIdea),
    onSuccess: (data) => {
      toast({
        title: 'Idea Created!',
        description: 'Redirecting to the analysis page...',
      });
      onIdeaCreated();
      setOpen(false);
      navigate(`/analysis/${data.id}`);
    },
    onError: (error) => {
      console.error('Creation error:', error);
      toast({
        title: 'Creation Failed',
        description: 'There was an issue creating your idea. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      originalIdea,
      context: {}, // Context can be expanded later
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Idea</DialogTitle>
          <DialogDescription>
            Give your idea a name and a brief description to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Idea Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., AI-Powered Hiking App"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Idea Description</Label>
            <Textarea
              id="description"
              value={originalIdea}
              onChange={(e) => setOriginalIdea(e.target.value)}
              placeholder="Describe your startup idea..."
              className="min-h-[100px]"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create & Analyze
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

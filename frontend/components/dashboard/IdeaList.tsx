import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface IdeaSummary {
  id: string;
  name: string;
  createdAt: Date;
}

interface IdeaListProps {
  ideas: IdeaSummary[];
}

export function IdeaList({ ideas }: IdeaListProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backend.idea.del({ id }),
    onSuccess: () => {
      toast({ title: 'Idea Deleted' });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
    onError: (error) => {
      console.error('Deletion error:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Could not delete the idea. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (ideas.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold">No Ideas Yet</h2>
        <p className="text-muted-foreground mt-2">
          Click "New Idea" to start validating your first startup concept.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideas.map((idea) => (
        <Card key={idea.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{idea.name}</CardTitle>
            <CardDescription>
              Created on {new Date(idea.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {/* Content can be added here later, e.g., a snippet of the idea */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                deleteMutation.mutate(idea.id);
              }}
              disabled={deleteMutation.isPending && deleteMutation.variables === idea.id}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => navigate(`/analysis/${idea.id}`)}>
              View Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

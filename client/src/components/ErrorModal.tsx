import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTryAgain: () => void;
  onClose: () => void;
  errorMessage?: string;
}

export default function ErrorModal({ 
  open, 
  onOpenChange, 
  onTryAgain, 
  onClose,
  errorMessage = "Unable to establish connection. This could be due to browser permissions, network issues, or an invalid session code."
}: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-lg">Connection Error</DialogTitle>
          </div>
          <DialogDescription>
            {errorMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={onTryAgain}
          >
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

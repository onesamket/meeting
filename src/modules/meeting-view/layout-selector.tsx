import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import type { LayoutSelectorProps } from './meeting-view.types';

export function LayoutSelector({ layout, setLayout }: LayoutSelectorProps) {
  return (
    <Button
      className="fixed right-8 top-24 z-10"
      variant="outline"
      size="icon"
      onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
    >
      {layout === 'grid' ? <LayoutGrid size={20} /> : <LayoutList size={20} />}
    </Button>
  );
}

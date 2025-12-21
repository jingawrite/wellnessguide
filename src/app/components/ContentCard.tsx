import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContentCardProps {
  id: number;
  title: string;
  image: string;
  onClick: () => void;
}

export function ContentCard({ title, image, onClick }: ContentCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="aspect-[16/9] bg-muted relative overflow-hidden">
        <ImageWithFallback 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-foreground">{title}</h3>
      </div>
    </div>
  );
}

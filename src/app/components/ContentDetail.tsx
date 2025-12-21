import { ArrowLeft, ExternalLink } from 'lucide-react';

interface ContentDetailProps {
  title: string;
  videoId?: string;
  imageUrl?: string;
  comment: string;
  products?: { name: string; link: string; }[];
  onBack: () => void;
}

// 볼드체 마크다운을 HTML로 변환하는 함수
function formatComment(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index}>{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function ContentDetail({ title, videoId, imageUrl, comment, products, onBack }: ContentDetailProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>목록으로</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-foreground mb-6">{title}</h1>
          
          {imageUrl ? (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-auto"
              />
            </div>
          ) : videoId ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : null}
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="mb-3 text-muted-foreground">큐레이터 진가의 코멘트</div>
          <div className="text-foreground leading-relaxed whitespace-pre-line">
            {formatComment(comment)}
          </div>
        </div>

        {products && products.length > 0 && (
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-foreground mb-4">관련 제품</h2>
            <div className="space-y-3">
              {products.map((product, index) => (
                <a
                  key={index}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <span className="text-foreground">{product.name}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';

interface Props {
  images: string[];
  alt: string;
}

export default function Gallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const handleErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      '/images/default.png';
  };
  return (
    <div>
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#f5f5f5',
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        <img
          src={images[active]}
          alt={alt}
          onError={handleErr}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {images.map((src, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: 64,
                height: 64,
                border:
                  i === active
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--color-border)',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 4,
              }}
            >
              <img
                src={src}
                alt={`${alt}-${i}`}
                onError={handleErr}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

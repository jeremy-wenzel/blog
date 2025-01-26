import '../styles/ImageLink.css';

export interface ImageLinkProps {
  icon: string;
  url: string;
  alternativeName: string;
  className?: string;
}

export default function ImageLink({ className, icon, url, alternativeName }: ImageLinkProps) {
  const pathToAsset = `/assets/${icon}`;
  return (
    <div className={className}>
      <a href={url}>
        <img className="imageLink" src={pathToAsset} alt={alternativeName} />
      </a>
    </div>
  )
}
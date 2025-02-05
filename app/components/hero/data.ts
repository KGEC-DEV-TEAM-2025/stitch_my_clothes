"use strict";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: 'https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748889/9d4635ce-e988-4e30-834e-0585a7ed9ad6.png', alt: 'Gallery Image 1' },
  { id: 2, src: 'https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748828/366bbecb-aa22-4ded-b344-bbac6f860848.png', alt: 'Gallery Image 2' },
  { id: 3, src: 'https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748985/Screenshot_2025-02-05_151644_tin9jw.png', alt: 'Gallery Image 3' }
];

export { galleryImages };

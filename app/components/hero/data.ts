"use strict";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: '/g1.jpg', alt: 'Gallery Image 1' },
  { id: 2, src: '/g2.webp', alt: 'Gallery Image 2' },
  { id: 3, src: '/g3.webp', alt: 'Gallery Image 3' }
];

export { galleryImages };

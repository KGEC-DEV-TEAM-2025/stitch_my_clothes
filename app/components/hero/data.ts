"use strict";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: '/archive/business-comes-naturally-cropped-shot-of-a-charmi-2023-01-09-21-59-29-utc.jpg', alt: 'Gallery Image 1' },
  { id: 2, src: '/archive/man-in-a-suit-holds-a-folder-2023-03-17-15-43-48-utc.jpg', alt: 'Gallery Image 2' },
  { id: 3, src: '/archive/portrait-of-a-young-man-in-a-shirt-and-trousers-2023-01-25-10-37-23-utc.jpg', alt: 'Gallery Image 3' }
];

export { galleryImages };

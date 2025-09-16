import { ImageItem } from "./ImageItem";

export interface ImageResponse {
  custno: string;
  nik: string;
  images: ImageItem[];
}
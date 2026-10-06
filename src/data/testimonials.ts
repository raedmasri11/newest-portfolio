import testimonialData from "./content/testimonials.json";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  company: string;
  published?: boolean;
  sortOrder?: number;
};

export const testimonials = (testimonialData as Testimonial[])
  .filter((item) => item.published !== false)
  .slice()
  .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));

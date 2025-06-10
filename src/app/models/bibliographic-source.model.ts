import { Author } from './author.model';
import { Keyword } from './keyword.model';

export interface BibliographicSource {
  code: string;
  title: string;
  authors: Author[];
  year: number;
  reference: string;
  url: string;
  type: string;
  media: string;
  driveUrl: string;
  imageUrl: string;
  notes: string;
  keywords: Keyword[];
  abstractText: string;
}

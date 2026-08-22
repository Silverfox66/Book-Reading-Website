export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  publishedYear?: number;
}

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
}

interface OpenLibraryResponse {
  docs?: OpenLibraryDoc[];
}

export async function searchBooksByTitle(title: string, signal?: AbortSignal): Promise<BookSearchResult[]> {
  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 2) return [];

  const params = new URLSearchParams({
    title: trimmedTitle,
    limit: '8',
    fields: 'key,title,author_name,first_publish_year,cover_i,subject',
  });
  const response = await fetch(`https://openlibrary.org/search.json?${params}`, { signal });
  if (!response.ok) throw new Error('Book search is unavailable right now.');

  const data = (await response.json()) as OpenLibraryResponse;
  return (data.docs || [])
    .filter((book) => book.title && book.author_name?.[0])
    .map((book) => ({
      id: book.key || `${book.title}-${book.author_name?.[0]}`,
      title: book.title!,
      author: book.author_name![0],
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '',
      genre: book.subject?.[0] || '',
      publishedYear: book.first_publish_year,
    }));
}

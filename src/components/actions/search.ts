'use server';

export async function searchAction(_prevState: string, formData: FormData): Promise<string> {
  const rawQuery = formData.get('query');
  const trimmedQuery = typeof rawQuery === 'string' ? rawQuery.trim() : '';

  if (!trimmedQuery) {
    return '';
  }

  return trimmedQuery;
}
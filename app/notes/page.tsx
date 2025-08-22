import { Metadata } from 'next';
import NotesClient from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
// import { type Note } from '@/types/note';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Notes page',
};
//

export default async function NotesPage() {
  const queryClient = new QueryClient();

  //значення для першого завантаження
  const search = '';
  const page = 1;
  const perPage = 12;

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search, page, perPage }],
    queryFn: () => fetchNotes(search, page, perPage),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient perPage={12} />
    </HydrationBoundary>
  );
}

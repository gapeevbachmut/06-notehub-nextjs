import { Metadata } from 'next';
import NotesClient from './Notes.client';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Notes page',
};
//
export default function NotesPage() {
  return <NotesClient />;
}

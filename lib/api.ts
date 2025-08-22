import axios from 'axios';
import { type Note, type CreateNoteType } from '@/types/note';

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const API_URL = 'https://notehub-public.goit.study/api/notes';

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number
): Promise<NotesResponse> {
  const config = {
    params: {
      search, // пошук -
      page, // сторінка
      perPage, // кількість на сторінці
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  };

  // await new Promise(r => setTimeout(r, 2000));

  const responce = await axios.get<NotesResponse>(`${API_URL}`, config);
  console.log(responce.data.notes);
  console.log('1', responce.data);

  return responce.data;
}

//  одна нотатка

export const fetchNoteById = async (id: Note['id']): Promise<Note> => {
  const responce = await axios.get<Note>(`${API_URL}/${id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });
  return responce.data;
};

//  видалення

export async function deleteNote(id: string): Promise<Note> {
  const responce = await axios.delete<Note>(`${API_URL}/${id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });
  return responce.data;
}

//  додавання

export async function createNote(noteData: CreateNoteType): Promise<Note> {
  const responce = await axios.post<Note>(`${API_URL}`, noteData, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });
  return responce.data;
}

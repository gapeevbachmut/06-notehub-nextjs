'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import { Toaster } from 'react-hot-toast';

import css from './NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

interface PerPageProps {
  perPage: number;
}

export default function NotesClient({ perPage }: PerPageProps) {
  const [searchQuery, setSearchQuery] = useState(''); // значення інпута
  const [currentPage, setCurrentPage] = useState(1); // pagination
  const [isModalOpen, setIsModalOpen] = useState(false); //модальне вікно

  // const perPage = 12;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  // Завантаження при першому рендері
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['notes', { search: searchQuery, page: currentPage }],

    queryFn: () => fetchNotes(searchQuery, currentPage, perPage),
    refetchOnMount: false, //не робити повторний запит, при монтуванні компонента клієнта
    placeholderData: keepPreviousData, //  дані відмалюються після запиту - чи треба це тут ???
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <>
      <h1>Мої нотатки!</h1>
      {/* клік сюди - очищати пошуковий запит - потім зробити */}
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={updateSearchQuery} />

          {/* //////////////////////////////// */}
          {/* {isLoading && <p>Завантаження...</p>}  */}

          {/* {isError && <p>Сталася помилка при завантаженні нотаток.</p>} */}

          {isSuccess && data && data.notes.length === 0 && (
            <p>Нотаток немає. Додайте першу!</p>
          )}
          {/* /////////////////////////////////////// */}
          {isSuccess && data && data.notes.length > 0 && (
            <Pagination
              pageCount={data.totalPages}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          )}

          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>

        {isLoading && <p>Завантаження...</p>}
        {isError && <p>Сталася помилка при завантаженні нотаток.</p>}

        {isSuccess && data && data.notes.length > 0 && (
          <NoteList notes={data.notes || []} />
        )}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
      </div>
      <Toaster />
    </>
  );
}

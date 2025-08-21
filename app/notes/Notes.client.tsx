'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/app/lib/api';
import { Toaster } from 'react-hot-toast';

import css from './NotesPage.module.css';
import NoteList from '@/app/components/NoteList/NoteList';
import SearchBox from '@/app/components/SearchBox/SearchBox';
import Pagination from '@/app/components/Pagination/Pagination';
import Modal from '@/app/components/Modal/Modal';
import NoteForm from '@/app/components/NoteForm/NoteForm';

// import NoteDetails from './[id]/page';

export default function NotesClient() {
  const [searchQuery, setSearchQuery] = useState(''); // значення інпута
  const [currentPage, setCurrentPage] = useState(1); // pagination
  const [isModalOpen, setIsModalOpen] = useState(false); //модальне вікно

  const perPage = 12;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  // Завантаження при першому рендері
  const { data, isSuccess, isLoading, error, isError } = useQuery({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage, perPage),
    placeholderData: keepPreviousData, //  дані відмалюються після запиту
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
          {/* {isLoading && <Loader />} */}
          {/* {isError && <ErrorMessage />} */}
          {isSuccess && data && data.notes.length > 0 ? (
            <Pagination
              pageCount={data.totalPages}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          ) : (
            !isLoading && <p>Немає нотаток за пошуковим запитом. </p>
          )}

          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        {/* {isLoading && <p>Завантаження нотаток...</p>} */}
        {/* {isError && <p>Помилка: {error.message}</p>} */}

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

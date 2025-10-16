'use client';

import { CalendarIcon, ChatIcon } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pagination } from '../../../components/Pagination';
import { getClientApi } from '../../../lib/api-client';

export function FeedbacksPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: feedbackData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['feedbacks', currentPage],
    queryFn: async () => {
      const api = getClientApi();
      const response = await api.Default.Admin.getFeedbacksAdminFeedbackGet(
        currentPage,
        10
      );
      return response.data;
    },
  });

  const feedbacks = feedbackData?.items || [];
  const totalPages = feedbackData?.pages || 1;
  const total = feedbackData?.total || 0;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="bg-danger-100 border border-danger-200 rounded-lg p-4">
        <p className="text-danger-800">
          {error instanceof Error
            ? error.message
            : 'Erro ao carregar feedbacks. Tente novamente.'}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-danger-600 underline hover:no-underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Feedbacks</h1>
        <p className="text-gray-600 ">
          Total de {total} feedback{total !== 1 ? 's' : ''} recebido
          {total !== 1 ? 's' : ''}
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 ">
          <ChatIcon size={48} className="mx-auto mb-4 text-primary" />
          <p>Nenhum feedback encontrado</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200  rounded-lg p-6 transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 ">
                    {feedback.title}
                  </h3>
                  <span className="text-sm text-gray-500  flex items-center gap-1">
                    <CalendarIcon size={16} />
                    {formatDate(feedback.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700  whitespace-pre-wrap">
                  {feedback.message}
                </p>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
